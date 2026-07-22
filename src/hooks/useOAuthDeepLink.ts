import { App as CapacitorApp } from "@capacitor/app";
import { useEffect, useRef, useState } from "react";

type OAuthDeepLink = {
  code: string;
  state: string;
};

type UseOAuthDeepLinkArgs = {
  onOAuthDeepLink: (deepLink: OAuthDeepLink) => void;
  onAccountDeepLink: (search: string) => void;
};

export function useOAuthDeepLink({
  onOAuthDeepLink,
  onAccountDeepLink,
}: UseOAuthDeepLinkArgs) {
  const processedUrls = useRef(new Set<string>());
  const [isLaunchUrlResolved, setIsLaunchUrlResolved] = useState(false);

  useEffect(() => {
    let isDisposed = false;
    let removeListener: (() => Promise<void>) | undefined;

    const handleUrl = (value?: string) => {
      if (!value || processedUrls.current.has(value)) {
        return;
      }

      try {
        const url = new URL(value);

        if (url.protocol !== "com.concierge.app:") {
          return;
        }

        if (url.hostname === "account" && (url.pathname === "" || url.pathname === "/")) {
          processedUrls.current.add(value);
          onAccountDeepLink(url.search);
          return;
        }

        if (url.hostname !== "oauth" || url.pathname !== "/redirect") {
          return;
        }

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
          return;
        }

        processedUrls.current.add(value);
        onOAuthDeepLink({ code, state });
      } catch (error) {
        console.error("Failed to parse OAuth deep link", error);
      }
    };

    void CapacitorApp.getLaunchUrl()
      .then((event) => handleUrl(event?.url))
      .catch((error) => console.error("Failed to get launch URL", error))
      .finally(() => {
        if (!isDisposed) {
          setIsLaunchUrlResolved(true);
        }
      });

    void CapacitorApp.addListener("appUrlOpen", (event) => {
      handleUrl(event.url);
    }).then((listener) => {
      if (isDisposed) {
        void listener.remove();
        return;
      }

      removeListener = () => listener.remove();
    });

    return () => {
      isDisposed = true;
      void removeListener?.();
    };
  }, [onAccountDeepLink, onOAuthDeepLink]);

  return isLaunchUrlResolved;
}

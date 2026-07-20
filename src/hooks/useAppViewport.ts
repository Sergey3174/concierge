import { useEffect } from "react";

export function useAppViewport() {
  useEffect(() => {
    const isIosStandalone =
      CSS.supports("(-webkit-touch-callout: none)") &&
      window.matchMedia("(display-mode: standalone)").matches;

    const isEditableElement = (element: EventTarget | null) =>
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      (element instanceof HTMLElement && element.isContentEditable);

    const showKeyboardViewport = (event: FocusEvent) => {
      if (isEditableElement(event.target)) {
        document.documentElement.classList.add("keyboard-open");
      }
    };

    const hideKeyboardViewport = () => {
      requestAnimationFrame(() => {
        if (!isEditableElement(document.activeElement)) {
          document.documentElement.classList.remove("keyboard-open");
        }
      });
    };

    const lockViewportScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const setAppHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
      lockViewportScroll();
    };

    setAppHeight();

    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("scroll", lockViewportScroll, { passive: true });

    if (isIosStandalone) {
      document.addEventListener("focusin", showKeyboardViewport);
      document.addEventListener("focusout", hideKeyboardViewport);
    }

    return () => {
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("scroll", lockViewportScroll);
      document.removeEventListener("focusin", showKeyboardViewport);
      document.removeEventListener("focusout", hideKeyboardViewport);
      document.documentElement.classList.remove("keyboard-open");
    };
  }, []);
}

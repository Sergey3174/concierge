import { Send } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchUserInfo, selectUserInfo } from "../store/authUserSlice";
import type { AppDispatch } from "../store/store";

const telegramBindErrorMessages: Record<string, string> = {
  provider_already_bound: "This provider is already linked.",
  login_already_bound: "This login is already in use by another user.",
  oauth_code_invalid_or_expired: "Authorization is invalid or has expired.",
  oauth_user_not_found: "Telegram user not found.",
  bind_failed: "Failed to link Telegram. Please try again.",
};

function AccountPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector(selectUserInfo);
  const [searchParams] = useSearchParams();
  const telegram = userInfo?.providers.telegram;

  const telegramBindFeedback = useMemo(() => {
    const provider = searchParams.get("bind_provider");
    const status = searchParams.get("bind_status");
    const errorKey = searchParams.get("error_key");

    if (
      provider !== "telegram" ||
      (status !== "success" && status !== "error")
    ) {
      return null;
    }

    return status === "success"
      ? { type: "success" as const, message: "Telegram linked successfully." }
      : {
          type: "error" as const,
          message:
            (errorKey ? telegramBindErrorMessages[errorKey] : undefined) ??
            "An error occurred while linking Telegram.",
        };
  }, [searchParams]);

  useEffect(() => {
    if (telegramBindFeedback?.type === "success") {
      void dispatch(fetchUserInfo());
    }
  }, [dispatch, telegramBindFeedback?.type]);

  const bindTelegram = () => {
    window.location.assign(
      `${import.meta.env.VITE_BASENAME_API}/api/profile/bind/telegram`,
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center overflow-auto py-8 text-[var(--color-text-primary)]">
      <div className="mx-auto w-full max-w-md space-y-4">
        {telegramBindFeedback && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              telegramBindFeedback.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-600"
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}
          >
            {telegramBindFeedback.message}
          </div>
        )}

        <section className="rounded-xl  p-4">
          {telegram ? (
            <div className="flex items-center gap-3">
              <Send className="size-5 text-[#229ED9]" />
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">Telegram</h2>
                <p className="truncate text-sm text-[var(--color-text-soft)]">
                  {telegram.username
                    ? `@${telegram.username}`
                    : telegram.subject}
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={bindTelegram}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 text-[1rem] font-medium text-white transition hover:bg-[#1d8bc1]"
            >
              <Send size={19} />
              Привязать Telegram
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

export default AccountPage;

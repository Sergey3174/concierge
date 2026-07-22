import { Send } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AuthForm } from "../components/AuthForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import LOGO from "../../public/logo.png";

function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const openTelegramOAuth = () => {
    const source = Capacitor.isNativePlatform() ? "apk" : "pwa";
    window.location.assign(
      `${import.meta.env.VITE_BASENAME_API}/api/oauth/telegram?source=${source}`,
    );
  };

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 flex-1 flex-col overflow-auto pb-[calc(8px+var(--sa-b))] pt-2">
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-7">
          <div className="mx-auto flex size-[6rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
            <img src={LOGO} alt="logo" />
          </div>
          {isForgotPassword ? (
            <ForgotPasswordForm onBack={() => setIsForgotPassword(false)} />
          ) : (
            <AuthForm onForgotPassword={() => setIsForgotPassword(true)} />
          )}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 text-[1rem] font-medium text-white transition hover:bg-[#1d8bc1]"
            onClick={openTelegramOAuth}
          >
            <Send size={19} />
            {t("authPage.telegram")}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="py-3 text-[0.95rem] text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
        onClick={() => navigate("/registration")}
      >
        {t("authPage.switchToRegistration")}
      </button>
    </main>
  );
}

export default AuthPage;

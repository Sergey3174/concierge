import { Send } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { EmailConfirmationFlow } from "../components/EmailConfirmationFlow";
import { openExternalLink } from "../lib/openExternalLink";
import { fetchCreateUser } from "../store/authUserSlice";
import type { AppDispatch } from "../store/store";
import LOGO from "../../public/logo.png";

function RegistrationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");
  const openTelegramOAuth = async () => {
    const source = Capacitor.isNativePlatform() ? "apk" : "pwa";
    await openExternalLink(
      `${import.meta.env.VITE_BASENAME_API}/api/oauth/telegram?source=${source}`,
    );
  };

  const validatePassword = () => {
    if (!password) {
      return t("authPage.validation.passwordRequired");
    }

    return password.length < 8
      ? t("authPage.validation.passwordTooShort")
      : null;
  };

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 overflow-auto flex-1 flex-col pb-[calc(8px+var(--sa-b))] pt-2 ">
      <div className="flex flex-col flex-1 justify-center ">
        <div className="flex flex-col gap-7">
          <div className="mx-auto flex size-[6rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
            <img src={LOGO} alt="logo" />
          </div>
          <EmailConfirmationFlow
            submitLabel={t("authPage.registration")}
            submittingLabel={t("authPage.creatingAccount")}
            validateBeforeRequest={validatePassword}
            onConfirmed={async ({ email, hash }) => {
              await dispatch(
                fetchCreateUser({ login: email, password, hash }),
              ).unwrap();
              navigate("/", { replace: true });
            }}
          >
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder={t("authPage.passwordPlaceholderReg")}
              className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </EmailConfirmationFlow>
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
        onClick={() => navigate("/auth")}
      >
        {t("authPage.switchToLogin")}
      </button>
    </main>
  );
}

export default RegistrationPage;

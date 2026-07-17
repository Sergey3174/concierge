import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 flex-1 flex-col pb-2 pt-8">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 text-[1rem] font-medium text-white transition hover:bg-[#1d8bc1]"
      >
        <Send size={19} />
        {t("authPage.telegram")}
      </button>

      <form
        className="flex flex-1 flex-col justify-center gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="text"
          name="login"
          autoComplete="username"
          placeholder={t("authPage.loginPlaceholder")}
          className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder={t("authPage.passwordPlaceholder")}
          className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="mt-2 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
        >
          {t("authPage.login")}
        </button>
      </form>

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

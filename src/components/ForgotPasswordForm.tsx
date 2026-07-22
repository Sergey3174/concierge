import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import apiClient from "../lib/apiClient";

type ForgotPasswordFormProps = {
  onBack: () => void;
  email?: string;
};

type RecoveryStep = "email" | "code" | "password";

export function ForgotPasswordForm({
  onBack,
  email: providedEmail,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [manualEmail, setManualEmail] = useState("");
  const [code, setCode] = useState("");
  const [hash, setHash] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const email = providedEmail ?? manualEmail;

  const getErrorMessage = (requestError: unknown, fallback: string) => {
    if (axios.isAxiosError(requestError)) {
      if (typeof requestError.response?.data === "string") {
        return requestError.response.data;
      }

      if (typeof requestError.response?.data?.message === "string") {
        return requestError.response.data.message;
      }

      return requestError.message || fallback;
    }

    return requestError instanceof Error ? requestError.message : fallback;
  };

  const handleBack = () => {
    setError(null);

    if (step === "code") {
      setCode("");
      setStep("email");
      return;
    }

    if (step === "password") {
      setPassword("");
      setPasswordConfirmation("");
      setStep("code");
      return;
    }

    onBack();
  };

  const requestRecoveryCode = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("authPage.validation.emailInvalid"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.post(
        "/api/auth/confirm_login",
        { login: email.trim() },
        { params: { recovery: true } },
      );
      setStep("code");
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, t("authPage.errors.sendCode")),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRecoveryCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setError(t("authPage.validation.codeInvalid"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { data } = await apiClient.post(
        "/api/auth/confirm_login",
        { login: email.trim() },
        { params: { recovery: true, code: code.trim() } },
      );
      const recoveryHash = data?.data?.hash;

      if (!recoveryHash) {
        setError(t("authPage.validation.codeNotAccepted"));
        return;
      }

      setHash(recoveryHash);
      setStep("password");
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("authPage.errors.confirmCode")));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (password.length < 8) {
      setError(t("authPage.validation.passwordTooShort"));
      return;
    }

    if (password !== passwordConfirmation) {
      setError(t("authPage.validation.passwordsMismatch"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.post(
        "/api/auth/password_recovery",
        { login: email.trim(), password },
        { params: { guard_hash: hash } },
      );
      onBack();
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("authPage.errors.resetPassword")));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === "email") void requestRecoveryCode();
    if (step === "code") void confirmRecoveryCode();
    if (step === "password") void resetPassword();
  };

  return (
    <form
      className="flex flex-1 flex-col justify-center gap-3"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        aria-label={t("common.back")}
        className="flex size-10 items-center justify-center rounded-full text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
        onClick={handleBack}
      >
        <ArrowLeft size={20} />
      </button>

      {step === "email" && (
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder={t("common.email")}
          className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
          value={email}
          onChange={(event) => setManualEmail(event.target.value)}
          disabled={Boolean(providedEmail)}
        />
      )}

      {step === "code" && (
        <input
          type="text"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder={t("common.confirmationCode")}
          className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      )}

      {step === "password" && (
        <>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder={t("authPage.newPassword")}
            className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="password"
            name="passwordConfirmation"
            autoComplete="new-password"
            placeholder={t("authPage.repeatPassword")}
            className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
      >
        {isLoading
          ? t("common.pleaseWait")
          : step === "email"
            ? t("common.continue")
            : step === "code"
              ? t("common.confirmCode")
              : t("authPage.resetPassword")}
      </button>
    </form>
  );
}

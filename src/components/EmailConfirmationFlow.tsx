import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import apiClient from "../lib/apiClient";

type EmailConfirmationResult = {
  email: string;
  hash: string;
};

type EmailConfirmationFlowProps = {
  onConfirmed: (result: EmailConfirmationResult) => Promise<void> | void;
  validateBeforeRequest?: () => string | null;
  children?: ReactNode;
  submitLabel?: string;
  submittingLabel?: string;
};

export function EmailConfirmationFlow({
  onConfirmed,
  validateBeforeRequest,
  children,
  submitLabel,
  submittingLabel,
}: EmailConfirmationFlowProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeStep, setIsCodeStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const requestCode = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("authPage.validation.emailInvalid"));
      return;
    }

    const validationError = validateBeforeRequest?.();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiClient.post(
        "/api/auth/confirm_login",
        { login: email.trim() },
        { params: { recovery: false } },
      );
      setIsCodeStep(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("authPage.errors.sendCode")));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
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
        { params: { recovery: false, code: code.trim() } },
      );
      const hash = data?.data?.hash;

      if (!hash) {
        setError(t("authPage.validation.codeNotAccepted"));
        return;
      }

      await onConfirmed({ email: email.trim(), hash });
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("authPage.errors.confirmCode")));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-1 flex-col justify-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void (isCodeStep ? confirmCode() : requestCode());
      }}
    >
      {isCodeStep ? (
        <>
          <button
            type="button"
            aria-label={t("authPage.backToEmailDetails")}
            className="flex size-10 items-center justify-center rounded-full text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
            onClick={() => {
              setCode("");
              setError(null);
              setIsCodeStep(false);
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            name="otpCode"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t("common.confirmationCode")}
            className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </>
      ) : (
        <>
          <input
            type="email"
            name="login"
            autoComplete="username"
            placeholder={t("common.email")}
            className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {children}
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
      >
        {isLoading
          ? (submittingLabel ?? t("common.pleaseWait"))
          : isCodeStep
            ? t("common.confirmCode")
            : (submitLabel ?? t("common.continue"))}
      </button>
    </form>
  );
}

import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";

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
  submitLabel = "Continue",
  submittingLabel = "Please wait...",
}: EmailConfirmationFlowProps) {
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
      setError("Enter a valid email");
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
      setError(getErrorMessage(requestError, "Unable to send confirmation code"));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit confirmation code");
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
        setError("Confirmation code was not accepted");
        return;
      }

      await onConfirmed({ email: email.trim(), hash });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to confirm code"));
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
            aria-label="Back to email details"
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
            placeholder="Confirmation code"
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
            placeholder="Email"
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
          ? submittingLabel
          : isCodeStep
            ? "Confirm code"
            : submitLabel}
      </button>
    </form>
  );
}

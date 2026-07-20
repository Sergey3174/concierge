import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../store/authUserSlice";
import type { AppDispatch, RootState } from "../store/store";

type FormErrors = {
  email?: string;
  password?: string;
};

type AuthFormProps = {
  onForgotPassword: () => void;
};

export function AuthForm({ onForgotPassword }: AuthFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loginStatus = useSelector(
    (state: RootState) => state.authUser.anonymousSessionStatus,
  );
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "string") return error;

    if (axios.isAxiosError(error)) {
      if (typeof error.response?.data === "string") return error.response.data;
      if (typeof error.response?.data?.message === "string") {
        return error.response.data.message;
      }

      return error.message || fallback;
    }

    return error instanceof Error ? error.message : fallback;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!mail.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      await dispatch(loginUser({ login: mail.trim(), password })).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ email: getErrorMessage(error, "Unable to sign in") });
    }
  };

  return (
    <form
      className="flex flex-1 flex-col justify-center gap-3"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        name="login"
        autoComplete="username"
        placeholder={t("authPage.loginPlaceholder")}
        className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
        value={mail}
        onChange={(event) => {
          setMail(event.target.value);
          if (errors.email)
            setErrors((current) => ({ ...current, email: undefined }));
        }}
      />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={t("authPage.passwordPlaceholder")}
        className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (errors.password) {
            setErrors((current) => ({ ...current, password: undefined }));
          }
        }}
      />
      <button
        type="button"
        className="self-start text-sm text-[var(--color-accent)] transition hover:text-[var(--color-accent)]"
        onClick={onForgotPassword}
      >
        Forgot password
      </button>
      {(errors.email || errors.password) && (
        <p className="text-sm text-red-500">
          {errors.email ?? errors.password}
        </p>
      )}
      <button
        type="submit"
        disabled={loginStatus === "loading"}
        className="mt-2 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
      >
        {loginStatus === "loading" ? "Signing in..." : t("authPage.login")}
      </button>
    </form>
  );
}

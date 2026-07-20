import axios from "axios";
import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../store/authUserSlice";
import type { AppDispatch, RootState } from "../store/store";

type FormErrors = {
  email?: string;
  password?: string;
  otpCode?: string;
};

function AuthPage() {
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
    if (typeof error === "string") {
      return error;
    }

    if (axios.isAxiosError(error)) {
      if (typeof error.response?.data === "string") {
        return error.response.data;
      }

      if (typeof error.response?.data?.message === "string") {
        return error.response.data.message;
      }

      return error.message || fallback;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  };

  const validateLogin = () => {
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateLogin()) return;

    try {
      await dispatch(loginUser({ login: mail.trim(), password })).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ email: getErrorMessage(error, "Unable to sign in") });
    }
  };

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 flex-1 flex-col overflow-auto  pb-[calc(8px+var(--sa-b))] pt-2">
      <div className="flex flex-col flex-1 justify-center ">
        <div className="flex flex-col gap-18">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 text-[1rem] font-medium text-white transition hover:bg-[#1d8bc1]"
          >
            <Send size={19} />
            {t("authPage.telegram")}
          </button>

          <form
            className="flex flex-1 flex-col justify-center gap-3"
            onSubmit={handleAuth}
          >
            <input
              type="email"
              name="login"
              autoComplete="username"
              placeholder={t("authPage.loginPlaceholder")}
              className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
            />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder={t("authPage.passwordPlaceholder")}
              className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
            />
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
              {loginStatus === "loading"
                ? "Signing in..."
                : t("authPage.login")}
            </button>
          </form>
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

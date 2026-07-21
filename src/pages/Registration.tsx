import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/apiClient";
import { useDispatch, useSelector } from "react-redux";

import { fetchCreateUser } from "../store/authUserSlice";
import type { AppDispatch, RootState } from "../store/store";
import LOGO from "../../public/logo.png";

type FormErrors = {
  email?: string;
  password?: string;
  otpCode?: string;
};

function RegistrationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const createUserStatus = useSelector(
    (state: RootState) => state.authUser.anonymousSessionStatus,
  );

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
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

  const validateSignup = () => {
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

  const validateOtp = () => {
    const nextErrors: FormErrors = {};

    if (!otpCode.trim()) {
      nextErrors.otpCode = "Confirmation code is required";
    } else if (!/^\d{6}$/.test(otpCode.trim())) {
      nextErrors.otpCode = "Enter the 6-digit confirmation code";
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateSignup()) return;

    try {
      await apiClient.post(
        "/api/auth/confirm_login",
        { login: mail.trim() },
        {
          params: {
            recovery: false,
          },
        },
      );

      setErrors({});
      setShowOtp(true);
    } catch (error) {
      setErrors({
        email: getErrorMessage(error, "Unable to send confirmation code"),
      });
    }
  };

  const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateOtp()) return;

    try {
      const { data } = await apiClient.post(
        "/api/auth/confirm_login",
        { login: mail.trim() },
        {
          params: {
            recovery: false,
            code: otpCode.trim(),
          },
        },
      );

      const hash = data?.data?.hash;

      if (!hash) {
        setErrors({ otpCode: "Confirmation code was not accepted" });
        return;
      }

      await dispatch(
        fetchCreateUser({ login: mail.trim(), password, hash }),
      ).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({
        otpCode: getErrorMessage(error, "Unable to create account"),
      });
    }
  };

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 overflow-auto flex-1 flex-col pb-[calc(8px+var(--sa-b))] pt-2 ">
      <div className="flex flex-col flex-1 justify-center ">
        <div className="flex flex-col gap-7">
          <div className="mx-auto flex size-[6rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
            <img src={LOGO} alt="logo" />
          </div>
          <form
            className="flex flex-1 flex-col justify-center gap-3"
            onSubmit={showOtp ? handleSubmitCode : handleSubmit}
          >
            {!showOtp && (
              <>
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
                  autoComplete="new-password"
                  placeholder={t("authPage.passwordPlaceholderReg")}
                  className="w-full rounded-2xl border border-[var(--color-surface-disabled)] bg-[var(--color-bg-tertiary)] px-4 py-4 text-[1rem] text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                />
              </>
            )}
            {showOtp && (
              <>
                <button
                  type="button"
                  aria-label="Back to registration details"
                  className="flex size-10 items-center justify-center rounded-full text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
                  onClick={() => {
                    setShowOtp(false);
                    setOtpCode("");
                    setErrors({});
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
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    if (errors.otpCode) {
                      setErrors((prev) => ({ ...prev, otpCode: undefined }));
                    }
                  }}
                />
              </>
            )}
            {(errors.email || errors.password || errors.otpCode) && (
              <p className="text-sm text-red-500">
                {errors.email ?? errors.password ?? errors.otpCode}
              </p>
            )}
            <button
              type="submit"
              disabled={createUserStatus === "loading"}
              className="mt-2 w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
            >
              {createUserStatus === "loading"
                ? "Creating account..."
                : showOtp
                  ? "Confirm registration"
                  : t("authPage.registration")}
            </button>
          </form>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] px-5 py-4 text-[1rem] font-medium text-white transition hover:bg-[#1d8bc1]"
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

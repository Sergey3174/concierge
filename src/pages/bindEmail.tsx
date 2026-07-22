import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { EmailConfirmationFlow } from "../components/EmailConfirmationFlow";
import { bindEmail, fetchUserInfo } from "../store/authUserSlice";
import type { AppDispatch } from "../store/store";
import LOGO from "../../public/logo.png";

function BindEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");

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
            submitLabel={t("authPage.bindEmail")}
            submittingLabel={t("authPage.bindingEmail")}
            validateBeforeRequest={validatePassword}
            onConfirmed={async ({ email, hash }) => {
              await dispatch(
                bindEmail({ login: email, password, hash }),
              ).unwrap();
              await dispatch(fetchUserInfo());
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
        </div>
      </div>
    </main>
  );
}

export default BindEmailPage;

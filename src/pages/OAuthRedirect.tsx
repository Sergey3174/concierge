import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { loginWithOAuth } from "../store/authUserSlice";
import type { AppDispatch } from "../store/store";

function OAuthRedirectPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const missingCallbackParameters = !code || !state;

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;
    if (missingCallbackParameters) {
      return;
    }

    void dispatch(loginWithOAuth({ code, state }))
      .unwrap()
      .then(() => navigate("/", { replace: true }))
      .catch((requestError: unknown) => {
        setError(
          typeof requestError === "string"
            ? requestError
            : t("authPage.errors.oauth"),
        );
      });
  }, [code, dispatch, missingCallbackParameters, navigate, state, t]);

  return (
    <main className="flex flex-1 items-center justify-center px-5 text-center text-[var(--color-text-primary)]">
      <p>
        {error ??
          (missingCallbackParameters
            ? t("authPage.errors.oauthMissingParameters")
            : t("authPage.signingInTelegram"))}
      </p>
    </main>
  );
}

export default OAuthRedirectPage;

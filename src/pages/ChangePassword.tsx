import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { fetchUserInfo } from "../store/authUserSlice";
import type { AppDispatch } from "../store/store";
import LOGO from "../../public/logo.png";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    let isActive = true;

    void dispatch(fetchUserInfo())
      .unwrap()
      .then((userInfo) => {
        if (isActive) {
          setEmail(userInfo.providers.email?.subject);
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  return (
    <main className="flex mx-auto w-full max-w-2xl min-h-0 flex-1 flex-col overflow-auto pb-[calc(8px+var(--sa-b))] pt-2">
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-col gap-7">
          <div className="mx-auto flex size-[6rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
            <img src={LOGO} alt="logo" />
          </div>

          <ForgotPasswordForm email={email} onBack={() => navigate("/")} />
        </div>
      </div>
    </main>
  );
}

export default ChangePasswordPage;

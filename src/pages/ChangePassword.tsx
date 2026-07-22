import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { selectUserInfo } from "../store/authUserSlice";
import LOGO from "../../public/logo.png";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const email = userInfo?.providers.email?.subject;

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

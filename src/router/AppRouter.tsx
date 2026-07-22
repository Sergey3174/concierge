import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Navigate,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "../pages/Home";
import AppLayout from "../layout/AppLayout";
import PaymentsPage from "../pages/Payments";
import FaqPage from "../pages/Faq";
import WelcomePage from "../pages/Welcome";
import AuthPage from "../pages/Auth";
import RegistrationPage from "../pages/Registration";
import { BrowserOnlyRoute } from "./BrowserOnlyRoute";
import ChangePasswordPage from "../pages/ChangePassword";
import BindEmailPage from "../pages/bindEmail";
import OAuthRedirectPage from "../pages/OAuthRedirect";
import { AppOnlyRoute } from "./AppOnlyRoute";

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.info("[router] navigation", {
      pathname: location.pathname,
      hash: location.hash,
      queryParameters: [...new URLSearchParams(location.search).keys()],
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <RouteLogger />
      <Routes>
        <Route element={<AppOnlyRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/payment" element={<PaymentsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/bind-email" element={<BindEmailPage />} />
            <Route path="/oauth/redirect" element={<OAuthRedirectPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<BrowserOnlyRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

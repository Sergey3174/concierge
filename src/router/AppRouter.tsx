import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import AppLayout from "../layout/AppLayout";
import PaymentsPage from "../pages/Payments";
import FaqPage from "../pages/Faq";
import WelcomePage from "../pages/Welcome";
import AuthPage from "../pages/Auth";
import RegistrationPage from "../pages/Registration";
import { BrowserOnlyRoute } from "./BrowserOnlyRoute";
import { AppOnlyRoute } from "./AppOnlyRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<AppOnlyRoute />}> */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
        </Route>
        {/* </Route> */}

        <Route element={<BrowserOnlyRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

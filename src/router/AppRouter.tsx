import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import AppLayout from "../layout/AppLayout";
import PaymentsPage from "../pages/Payments";
import FaqPage from "../pages/Faq";
import WelcomePage from "../pages/Welcome";
import { AppOnlyRoute } from "./AppOnlyRoute";
import { BrowserOnlyRoute } from "./BrowserOnlyRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppOnlyRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/payment" element={<PaymentsPage />} />
            <Route path="/faq" element={<FaqPage />} />
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

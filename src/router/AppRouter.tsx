import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import AppLayout from "../layout/AppLayout";
import PaymentsPage from "../pages/Payments";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

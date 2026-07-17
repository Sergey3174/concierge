import { Capacitor } from "@capacitor/core";
import { Navigate, Outlet } from "react-router-dom";

function isPwa() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function AppOnlyRoute() {
  const isNativeApp = Capacitor.isNativePlatform();

  return isNativeApp || isPwa() ? <Outlet /> : <Navigate to="/welcome" replace />;
}

import { Capacitor } from "@capacitor/core";
import { Navigate, Outlet } from "react-router-dom";

function isPwa() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function BrowserOnlyRoute() {
  const isNativeApp = Capacitor.isNativePlatform();

  return isNativeApp || isPwa() ? <Navigate to="/" replace /> : <Outlet />;
}

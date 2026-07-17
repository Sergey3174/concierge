import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function isPwa() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function BrowserOnlyRoute() {
  const isNativeApp = Capacitor.isNativePlatform();
  const [isInstalledPwa, setIsInstalledPwa] = useState(isPwa);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const updatePwaState = () => setIsInstalledPwa(mediaQuery.matches);

    window.addEventListener("appinstalled", updatePwaState);
    mediaQuery.addEventListener("change", updatePwaState);

    return () => {
      window.removeEventListener("appinstalled", updatePwaState);
      mediaQuery.removeEventListener("change", updatePwaState);
    };
  }, []);

  return isNativeApp || isInstalledPwa ? <Navigate to="/" replace /> : <Outlet />;
}

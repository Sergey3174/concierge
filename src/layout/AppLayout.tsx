import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { DefaultTaskPicker } from "../components/DefaultTaskPicker";
import { MobileDrawer } from "../components/MobileDrawer";
import { SettingsEditorSheet } from "../components/SettingsEditorSheet";
import { addChat } from "../store/chatsSlice";
import type { AppDispatch } from "../store/store";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M4 7H20M4 12H16M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export type AppLayoutOutletContext = {
  openDefaultTask: () => void;
};

// type IosNavigator = Navigator & {
//   standalone?: boolean;
// };

// function isIosDevice() {
//   return (
//     /iPad|iPhone|iPod/.test(navigator.userAgent) ||
//     (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
//   );
// }

function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenDefaultTask, setIsOpenDefaultTask] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const outletContext = {
    openDefaultTask: () => setIsOpenDefaultTask(true),
  } satisfies AppLayoutOutletContext;

  // useEffect(() => {
  //   const isIosStandalone =
  //     (navigator as IosNavigator).standalone === true ||
  //     (isIosDevice() &&
  //       window.matchMedia("(display-mode: standalone)").matches);

  //   if (isIosStandalone) {
  //     document.documentElement.style.removeProperty("--app-height");
  //     return;
  //   }

  //   const lockViewportScroll = () => {
  //     window.scrollTo(0, 0);
  //     document.documentElement.scrollTop = 0;
  //     document.body.scrollTop = 0;
  //   };

  //   const setAppHeight = () => {
  //     const height = window.visualViewport?.height ?? window.innerHeight;
  //     document.documentElement.style.setProperty("--app-height", `${height}px`);
  //     lockViewportScroll();
  //   };

  //   setAppHeight();

  //   window.visualViewport?.addEventListener("resize", setAppHeight);
  //   window.visualViewport?.addEventListener("scroll", setAppHeight);
  //   window.addEventListener("resize", setAppHeight);
  //   window.addEventListener("scroll", lockViewportScroll, { passive: true });

  //   return () => {
  //     window.visualViewport?.removeEventListener("resize", setAppHeight);
  //     window.visualViewport?.removeEventListener("scroll", setAppHeight);
  //     window.removeEventListener("resize", setAppHeight);
  //     window.removeEventListener("scroll", lockViewportScroll);
  //   };
  // }, []);

  const handleSelectService = (service: string) => {
    const createdAt = new Date().toISOString();
    const id = Date.now();

    dispatch(
      addChat({
        id: `chat-${id}`,
        title: service,
        preview: service,
        updatedAt: createdAt,
        messages: [
          {
            id: `msg-${id}`,
            role: "user",
            content: service,
            createdAt,
          },
        ],
      }),
    );
    setIsOpenDefaultTask(false);
    navigate("/");
  };

  return (
    <>
      <div className="app-shell overflow-hidden pt-[var(--sa-t)] pb-[var(--sa-b)]">
        <div className="relative mx-auto flex h-full w-full flex-col overflow-hidden">
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            openDefaultTask={() => setIsOpenDefaultTask(true)}
          />

          <div
            className={`relative z-20 flex min-h-0 flex-1 flex-col px-5  pt-4 transition-transform duration-300 ease-out ${
              isDrawerOpen ? "translate-x-[320px]" : "translate-x-0"
            }`}
          >
            <header className="flex items-center justify-between">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
              >
                <MenuIcon />
              </button>
            </header>
            <Outlet context={outletContext} />
          </div>
        </div>
      </div>
      <SettingsEditorSheet
        isOpen={isOpenDefaultTask}
        onClose={() => setIsOpenDefaultTask(false)}
        showHeader={false}
        showCloseButton={false}
        showSaveButtons={false}
        overlayClassName="bg-[var(--color-overlay-strong)]"
        sheetBaseClassName=""
        sheetClassName="mx-auto w-full max-w-3xl bg-[var(--color-surface)] px-4 pb-8 pt-2 shadow-[var(--shadow-sheet)]"
      >
        <DefaultTaskPicker onSelect={handleSelectService} />
      </SettingsEditorSheet>
    </>
  );
}

export default AppLayout;

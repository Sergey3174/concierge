import { useState } from "react";
import { Outlet } from "react-router-dom";

import { DefaultTaskPicker } from "../components/DefaultTaskPicker";
import { MobileDrawer } from "../components/MobileDrawer";
import { SettingsEditorSheet } from "../components/SettingsEditorSheet";

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

function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenDefaultTask, setIsOpenDefaultTask] = useState(false);
  const outletContext = {
    openDefaultTask: () => setIsOpenDefaultTask(true),
  } satisfies AppLayoutOutletContext;

  return (
    <>
      <div className="app-shell overflow-hidden">
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
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/8"
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
        overlayClassName="bg-black/40"
        sheetBaseClassName=""
        sheetClassName="mx-auto w-full max-w-3xl bg-[#1f1f1f] px-4 pb-8 pt-2 shadow-[0_-24px_60px_rgba(0,0,0,0.48)]"
      >
        <DefaultTaskPicker onSelect={() => setIsOpenDefaultTask(false)} />
      </SettingsEditorSheet>
    </>
  );
}

export default AppLayout;

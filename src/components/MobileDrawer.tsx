import {
  ArrowLeft,
  Coins,
  Globe,
  HelpCircle,
  KeyRound,
  Link,
  LogOut,
  Settings,
  Send,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { AppLanguage } from "../i18n";
import { SettingsEditorSheet } from "./SettingsEditorSheet";
import { changeLanguage } from "../store/appSlice";
import {
  selectChats,
  selectCurrentChatId,
  setCurrentChat,
} from "../store/chatsSlice";
import type { AppDispatch, RootState } from "../store/store";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  openDefaultTask: () => void;
};

const primaryItems = [
  { icon: "edit", key: "new-request" },
  { icon: "grid", key: "services" },
  { icon: "coins", key: "accounts" },
];

const settingsItems = [
  { key: "language", icon: Globe },
  {
    key: "password",
    icon: KeyRound,
  },
  {
    key: "email",
    icon: Link,
  },
  {
    key: "telegram",
    icon: Send,
  },
  {
    key: "faq",
    icon: HelpCircle,
  },
  {
    key: "logout",
    icon: LogOut,
  },
];

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M12 20H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L4 19L5 15L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <rect
        x="4.5"
        y="4.5"
        width="5"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14.5"
        y="4.5"
        width="5"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="4.5"
        y="14.5"
        width="5"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14.5"
        y="14.5"
        width="5"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DrawerItemIcon({ icon }: { icon: string }) {
  if (icon === "edit") return <EditIcon />;
  if (icon === "coins") return <Coins />;
  return <GridIcon />;
}

export function MobileDrawer({
  isOpen,
  onClose,
  openDefaultTask,
}: MobileDrawerProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector((state: RootState) => selectChats(state));
  const currentChatId = useSelector((state: RootState) =>
    selectCurrentChatId(state),
  );
  const language = useSelector((state: RootState) => state.app.language);
  const { t } = useTranslation();
  const [isSettingsView, setIsSettingsView] = useState(false);
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSettingsView(false);
    }
  }, [isOpen]);

  const openLanguageSettings = () => {
    setIsLanguageSheetOpen(true);
  };

  const saveLanguage = async (selectedLanguage: AppLanguage) => {
    await dispatch(changeLanguage(selectedLanguage)).unwrap();
    setIsLanguageSheetOpen(false);
  };

  const handleOpenDefaultTask = (key: string) => {
    if (key === "services") {
      onClose();
      openDefaultTask();
      navigate("/");
      return;
    }

    if (key === "accounts") {
      onClose();
      navigate("/payment");
      return;
    }

    if (key === "new-request") {
      onClose();
      dispatch(setCurrentChat(null));
      navigate("/");
      return;
    }
  };

  const handleSelectChat = (chatId: string) => {
    dispatch(setCurrentChat(chatId));
    navigate("/");
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-[var(--color-overlay)] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`absolute inset-y-0 left-0 z-40 flex w-[84%] max-w-[320px] flex-col bg-[var(--color-bg)] px-6 pb-4 pt-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSettingsView && (
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                onClick={() => setIsSettingsView(false)}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-[2rem] font-normal tracking-tight text-[var(--color-text-primary)]">
              {isSettingsView ? t("settings.title") : t("app.name")}
            </h2>
          </div>
        </div>

        <div className="relative mt-6 min-h-0 flex-1 hide-scrollbar overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col transition-all duration-300 ${
              isSettingsView
                ? "pointer-events-none -translate-x-8 opacity-0"
                : "pointer-events-auto translate-x-0 opacity-100"
            }`}
          >
            <div className="space-y-1">
              {primaryItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="flex w-full items-center gap-5 rounded-lg px-1 py-1 text-left text-[1.05rem] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)]"
                  onClick={() => handleOpenDefaultTask(item.key)}
                >
                  <span className="text-[var(--color-text-secondary)]">
                    <DrawerItemIcon icon={item.icon} />
                  </span>
                  <span>{t(`navigation.${item.key}`)}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 min-h-0 flex-1 overflow-auto hide-scrollbar">
              <p className="text-[0.95rem] text-[var(--color-text-subtle)]">
                {t("navigation.recentRequests")}
              </p>
              <div className="mt-4 space-y-1 pr-1">
                {chats.map((chat) => {
                  const isActive = chat.id === currentChatId;

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      className={`block w-full truncate rounded-lg px-4 py-1 text-left text-[1rem] transition ${
                        isActive
                          ? "bg-[var(--color-surface-disabled)] text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                      }`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      {chat.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 overflow-y-auto hide-scrollbar transition-all duration-300 ${
              isSettingsView
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0"
            }`}
          >
            <div className="space-y-2">
              {settingsItems.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-[var(--color-surface-muted)] px-4 py-4 text-left transition hover:bg-[var(--color-surface-muted-hover)]"
                  onClick={
                    key === "language" ? openLanguageSettings : undefined
                  }
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[var(--color-text-muted)]">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-[1rem] text-[var(--color-text-primary)]">
                        {t(`settings.${key}.title`)}
                      </span>
                      <span className="block text-sm text-[var(--color-text-soft)]">
                        {key === "language"
                          ? t(`settings.language.${language}`)
                          : t(`settings.${key}.description`)}
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="flex items-center gap-3 rounded-full px-2 py-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-avatar)] text-xl font-medium">
              U
            </div>
            <span className="text-[1.05rem]">User</span>
          </button>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)] ${
              isSettingsView
                ? "bg-[var(--color-surface-disabled)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-muted)]"
            }`}
            onClick={() => setIsSettingsView((prev) => !prev)}
          >
            <Settings />
          </button>
        </div>
      </aside>

      <SettingsEditorSheet
        isOpen={isLanguageSheetOpen}
        title={t("settings.language.title")}
        description={t("settings.language.description")}
        onClose={() => setIsLanguageSheetOpen(false)}
        overlayClassName="z-50"
        sheetClassName="z-[60]"
        showSaveButtons={false}
      >
        <div className="space-y-2 pb-6">
          {(["en", "ru"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => saveLanguage(option)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-4 text-left transition ${
                language === option
                  ? "border-[var(--color-accent)] bg-[var(--color-surface-soft)] text-[var(--color-text-primary)]"
                  : "border-[var(--color-surface-disabled)] text-[var(--color-text-muted)]"
              }`}
            >
              <span className="font-medium">
                {t(`settings.language.${option}`)}
              </span>
              {language === option && (
                <span className="text-sm text-[var(--color-accent)]">
                  <Check />
                </span>
              )}
            </button>
          ))}
        </div>
      </SettingsEditorSheet>
    </>
  );
}

import {
  ArrowLeft,
  ChevronRight,
  Coins,
  Globe,
  HelpCircle,
  KeyRound,
  Link,
  LogOut,
  Settings,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  openDefaultTask: () => void;
};

const primaryItems = [
  { label: "Новый запрос", icon: "edit", key: "new-request" },
  { label: "Услуги", icon: "grid", key: "services" },
  { label: "Счета", icon: "coins", key: "accounts" },
];

const recentItems = [
  "Тест прошёл успешно...",
  "Тест прошёл успешно...",
  "Тест прошёл успешно...",
  "Тест прошёл успешно...",
  "Тест прошёл успешно...",
  "Тест прошёл успешно...",
];

const settingsItems = [
  {
    title: "Смена языка интерфейса",
    description: "Русский, English и другие языки",
    icon: Globe,
  },
  {
    title: "Смена пароля",
    description: "Обновить пароль для входа",
    icon: KeyRound,
  },
  {
    title: "Привязка email",
    description: "Подключить или изменить почту",
    icon: Link,
  },
  {
    title: "Привязка Telegram",
    description: "Связать аккаунт с Telegram",
    icon: Send,
  },
  {
    title: "FAQ",
    description: "Ответы на частые вопросы",
    icon: HelpCircle,
  },
  {
    title: "Выход",
    description: "Завершить текущую сессию",
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
  const [isSettingsView, setIsSettingsView] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSettingsView(false);
    }
  }, [isOpen]);

  const handleOpenDefaultTask = (key: string) => {
    if (key === "services") {
      onClose();
      openDefaultTask();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-30 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`absolute inset-y-0 left-0 z-40 flex w-[84%] max-w-[320px] flex-col bg-black px-6 pb-4 pt-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSettingsView && (
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/72 transition hover:bg-white/8 hover:text-white"
                onClick={() => setIsSettingsView(false)}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-[2rem] font-normal tracking-tight text-white/92">
              {isSettingsView ? "Настройки" : "Concierge"}
            </h2>
          </div>
        </div>

        <div className="relative mt-6 min-h-0 flex-1 overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isSettingsView
                ? "pointer-events-none -translate-x-8 opacity-0"
                : "pointer-events-auto translate-x-0 opacity-100"
            }`}
          >
            <div className="space-y-1">
              {primaryItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-5 rounded-2xl px-1 py-1 text-left text-[1.05rem] text-white/86 transition hover:bg-white/6"
                  onClick={() => handleOpenDefaultTask(item.key)}
                >
                  <span className="text-white/82">
                    <DrawerItemIcon icon={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 min-h-0 flex-1 overflow-auto">
              <p className="text-[0.95rem] text-white/42">Последние запросы</p>
              <div className="mt-4 space-y-1 overflow-y-auto pr-1">
                {recentItems.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    className={`block w-full truncate rounded-full px-4 py-1 text-left text-[1rem] transition ${
                      index === 0
                        ? "bg-white/10 text-white/92"
                        : "text-white/76 hover:bg-white/6 hover:text-white/92"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 overflow-y-auto transition-all duration-300 ${
              isSettingsView
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0"
            }`}
          >
            <div className="space-y-2">
              {settingsItems.map(({ title, description, icon: Icon }) => (
                <button
                  key={title}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-4 text-left transition hover:bg-white/[0.07]"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-white/78">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-[1rem] text-white/92">
                        {title}
                      </span>
                      <span className="block text-sm text-white/45">
                        {description}
                      </span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-white/35" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="flex items-center gap-3 rounded-full px-2 py-2 text-white/92 transition hover:bg-white/6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-700 text-xl font-medium">
              U
            </div>
            <span className="text-[1.05rem]">User</span>
          </button>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/8 hover:text-white ${
              isSettingsView ? "bg-white/10 text-white" : "text-white/72"
            }`}
            onClick={() => setIsSettingsView((prev) => !prev)}
          >
            <Settings />
          </button>
        </div>
      </aside>
    </>
  );
}

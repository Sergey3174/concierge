import { Coins, Settings } from "lucide-react";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  openDefaultTask: () => void;
};

const primaryItems = [
  { label: "Новый запрос", icon: "edit", key: "new-request" },
  // { label: "Search chats", icon: "search" },
  // { label: "Images", icon: "image" },
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <rect
        x="3.75"
        y="4.75"
        width="16.5"
        height="14.5"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 17L11.5 12.5C12.1 11.9 13.1 11.9 13.7 12.5L17 15.8C17.6 16.4 18.6 16.4 19.2 15.8L20.25 14.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DrawerItemIcon({ icon }: { icon: string }) {
  if (icon === "edit") return <EditIcon />;
  if (icon === "search") return <SearchIcon />;
  if (icon === "image") return <ImageIcon />;
  if (icon === "coins") return <Coins />;
  return <GridIcon />;
}

export function MobileDrawer({
  isOpen,
  onClose,
  openDefaultTask,
}: MobileDrawerProps) {
  const handleOpenDefaultTask = (key: string) => {
    if (key === "services") {
      onClose();
      openDefaultTask();
      return;
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
          <h2 className="text-[2rem] font-normal tracking-tight text-white/92">
            Concierge
          </h2>
        </div>

        <div className="mt-6 space-y-1">
          {primaryItems.map((item) => (
            <button
              key={item.label}
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
                key={item}
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

        <div className="flex items-center justify-between">
          <button className="flex items-center gap-3 rounded-full px-2 py-2 text-white/92 transition hover:bg-white/6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-700 text-xl font-medium">
              U
            </div>
            <span className="text-[1.05rem]">User</span>
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-full text-white/72 transition hover:bg-white/8 hover:text-white">
            <Settings />
          </button>
        </div>
      </aside>
    </>
  );
}

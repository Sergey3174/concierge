import { BrushCleaning, Languages, ShieldUser, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

type DefaultTaskPickerProps = {
  onSelect?: (value: string) => void;
};

const tools = [
  {
    id: "small-repairs",
    icon: Wrench,
  },
  {
    id: "cleaning",
    icon: BrushCleaning,
  },
  {
    id: "translator-services",
    icon: Languages,
  },
  {
    id: "accompaniment",
    icon: ShieldUser,
  },
];

export function DefaultTaskPicker({ onSelect }: DefaultTaskPickerProps) {
  const { t } = useTranslation();

  return (
    <div className="text-[var(--color-text-primary)]">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[var(--color-text-muted)]" />
      {/* 
      <div className="mb-6 grid grid-cols-3 gap-3">
        {quickActions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect?.(id)}
            className="flex min-h-28 flex-col items-center justify-center rounded-[2rem] bg-[#111111] px-3 py-5 text-center transition hover:bg-[#202020]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl  text-white/88">
              <Icon size={28} strokeWidth={1.8} />
            </span>
            <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-white/92">
              {label}
            </span>
          </button>
        ))}
      </div> */}

      <div className="space-y-1">
        {tools.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect?.(id)}
            className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left transition hover:bg-[var(--color-surface-muted)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[var(--color-text-secondary)]">
              <Icon size={25} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <span className="block text-xl leading-none tracking-[-0.05em] text-[var(--color-text-primary)]">
                {t(`services.${id}.title`)}
              </span>
              <span className="mt-1 block text-lg leading-6 text-[var(--color-text-soft)]">
                {t(`services.${id}.description`)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

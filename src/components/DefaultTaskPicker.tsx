import { BrushCleaning, Languages, ShieldUser, Wrench } from "lucide-react";

type DefaultTaskPickerProps = {
  onSelect?: (value: string) => void;
};

const tools = [
  {
    id: "small-repairs",
    title: "Small Repairs",
    description: "Air conditioner cleaning, boiler repairs",
    icon: Wrench,
  },
  {
    id: "cleaning",
    title: "Cleaning",
    description: "Cleaning for rooms, apartments, villas, etc.",
    icon: BrushCleaning,
  },
  {
    id: "translator-services",
    title: "Translator Services",
    description: "Support at meetings, video calls, etc.",
    icon: Languages,
  },
  {
    id: "accompaniment",
    title: "Event Support",
    description: "Support at exhibitions, medical centers, etc.",
    icon: ShieldUser,
  },
];

export function DefaultTaskPicker({ onSelect }: DefaultTaskPickerProps) {
  return (
    <div className="text-white">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/70" />
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
        {tools.map(({ id, title, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect?.(id)}
            className="flex w-full items-center gap-4 rounded-[1.65rem] px-2 py-3 text-left transition hover:bg-white/[0.04]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white/82">
              <Icon size={25} strokeWidth={1.7} />
            </span>
            <span className="min-w-0">
              <span className="block text-xl leading-none tracking-[-0.05em] text-white/95 ">
                {title}
              </span>
              <span className="mt-1 block text-lg leading-6 text-white/50">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

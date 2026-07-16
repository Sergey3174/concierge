import {
  ArrowLeft,
  ChevronRight,
  ListChecks,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { useState } from "react";

import { serviceCategories } from "../mocks/serviceCatalog";

type DefaultTaskPickerProps = {
  onSelect?: (value: string) => void;
};

export function DefaultTaskPicker({ onSelect }: DefaultTaskPickerProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const selectedCategory = serviceCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  return (
    <div className="text-[var(--color-text-primary)]  max-h-[75vh] flex flex-col">
      <div className="mx-auto mb-4 h-1.5 w-16 shrink-0 rounded-full bg-[var(--color-text-muted)]" />

      {selectedCategory ? (
        <>
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="mb-4 flex items-center gap-2 rounded-lg py-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft size={20} />
            <span>Все категории</span>
          </button>

          <h2 className="mb-4 text-xl leading-tight tracking-[-0.03em] text-[var(--color-text-primary)]">
            {selectedCategory.title}
          </h2>

          <div className=" space-y-1 overflow-y-auto pr-1 hide-scrollbar">
            {selectedCategory.services.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => onSelect?.(service)}
                className="flex w-full  gap-3 items-center rounded-lg px-2 py-3 text-left text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
              >
                <MessageCircleQuestionIcon className="shrink-0 text-[var(--color-accent)]" />
                <span className="text-base leading-6">{service}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-xl tracking-[-0.03em] text-[var(--color-text-primary)]">
            Категории услуг
          </h2>

          <div className=" space-y-1 overflow-y-auto pr-1 hide-scrollbar">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left transition hover:bg-[var(--color-surface-muted)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-secondary)]">
                  <ListChecks size={23} strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg leading-6 text-[var(--color-text-primary)]">
                    {category.title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-accent)]">
                    {category.services.length} услуг
                  </span>
                </span>
                <ChevronRight
                  size={20}
                  className="shrink-0 text-[var(--color-text-muted)]"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import {
  ArrowLeft,
  ChevronRight,
  ListChecks,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { serviceCategories } from "../mocks/serviceCatalog";

type DefaultTaskPickerProps = {
  onSelect?: (value: string) => void;
};

export function DefaultTaskPicker({ onSelect }: DefaultTaskPickerProps) {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const categoryListRef = useRef<HTMLDivElement>(null);
  const categoryScrollTopRef = useRef(0);
  const selectedCategory = serviceCategories.find(
    (category) => category.id === selectedCategoryId,
  );

  useLayoutEffect(() => {
    if (!selectedCategoryId && categoryListRef.current) {
      categoryListRef.current.scrollTop = categoryScrollTopRef.current;
    }
  }, [selectedCategoryId]);

  const handleSelectCategory = (categoryId: number) => {
    categoryScrollTopRef.current = categoryListRef.current?.scrollTop ?? 0;
    setSelectedCategoryId(categoryId);
  };

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
            <span>{t("serviceCatalog.back")}</span>
          </button>

          <h2 className="mb-4 text-xl leading-tight tracking-[-0.03em] text-[var(--color-text-primary)]">
            {t(selectedCategory.titleKey)}
          </h2>

          <div className=" space-y-1 overflow-y-auto pr-1 hide-scrollbar">
            {selectedCategory.services.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => onSelect?.(t(service))}
                className="flex w-full  gap-3 items-center rounded-lg px-2 py-2 text-left text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
              >
                <div className="bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] p-2 shrink-0 rounded-full">
                  {" "}
                  <MessageCircleQuestionIcon className="shrink-0 text-[var(--color-accent)]" />
                </div>

                <span className="text-base leading-6">{t(service)}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-xl tracking-[-0.03em] text-[var(--color-text-primary)]">
            {t("serviceCatalog.title")}
          </h2>

          <div
            ref={categoryListRef}
            className=" space-y-1 overflow-y-auto pr-1 hide-scrollbar"
          >
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleSelectCategory(category.id)}
                className="flex w-full items-center gap-4 rounded-lg px-2 py-2 text-left transition hover:bg-[var(--color-surface-muted)]"
              >
                <div className="bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] p-1.5 shrink-0 rounded-full">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--color-text-secondary)]">
                    <ListChecks size={23} strokeWidth={1.7} />
                  </span>
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg leading-6 text-[var(--color-text-primary)]">
                    {t(category.titleKey)}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-accent)]">
                    {t("serviceCatalog.serviceCount", {
                      count: category.services.length,
                    })}
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


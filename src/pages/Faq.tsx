import { ChevronDown } from "lucide-react";
import { faq } from "../mocks/faq";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FaqItem } from "../mocks/faq";

type FaqCardProps = {
  item: FaqItem;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
};

const FaqCard = memo(function FaqCard({
  item,
  index,
  isSelected,
  onSelect,
}: FaqCardProps) {
  const { t } = useTranslation();
  console.log(index);

  return (
    <article
      className="[contain:layout_paint] items-center gap-4 rounded-lg bg-[var(--color-surface)] px-4 py-4 shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-surface-hover)]"
      onClick={() => onSelect(index)}
    >
      <div className="flex min-w-0">
        <h2 className="flex-1 text-[1.02rem] font-medium text-[var(--color-text-primary)]">
          {t(`faq.${item.key}.question`)}
        </h2>
        <ChevronDown
          className={`transition-transform duration-150 ${
            isSelected ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSelected
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
            {t(`faq.${item.key}.answer`)}
          </p>
        </div>
      </div>
    </article>
  );
});

function FaqPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(0);
  const { t } = useTranslation();

  const handleAnswerClick = useCallback((index: number) => {
    setSelectedAnswer((selectedIndex) =>
      selectedIndex === index ? null : index,
    );
  }, []);

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="app-scroll-area mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto hide-scrollbar py-1">
        <div className="mx-auto flex w-full max-w-2xl flex-col px-0 pb-8">
          <h1 className="text-[2rem] font-light tracking-[-0.04em] text-[var(--color-text-primary)]">
            {t("faq.title")}
          </h1>

          <div className="mt-5 space-y-3">
            {faq.map((item, index) => (
              <FaqCard
                key={item.key}
                item={item}
                index={index}
                isSelected={index === selectedAnswer}
                onSelect={handleAnswerClick}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default FaqPage;

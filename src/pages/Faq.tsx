import { ChevronDown } from "lucide-react";
import { faq } from "../mocks/faq";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function FaqPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(0);
  const { t } = useTranslation();

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer((selectedIndex) =>
      selectedIndex === index ? null : index,
    );
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="app-scroll-area mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto hide-scrollbar py-1">
        <div className="mx-auto flex w-full max-w-2xl flex-col px-0 pb-8">
          <h1 className="text-[2rem] font-light tracking-[-0.04em] text-[var(--color-text-primary)]">
            {t("faq.title")}
          </h1>

          <div className="mt-5 space-y-3">
            {faq.map((item, index) => {
              return (
                <article
                  key={item.key}
                  className="items-center gap-4 rounded-lg bg-[var(--color-surface)] px-4 py-4 shadow-[var(--shadow-card)] transition hover:bg-[var(--color-surface-hover)]"
                  onClick={() => handleAnswerClick(index)}
                >
                  <div className="flex min-w-0 ">
                    <h2 className="text-[1.02rem] flex-1 font-medium text-[var(--color-text-primary)]">
                      {t(`faq.${item.key}.question`)}
                    </h2>
                    <ChevronDown
                      className={`transition ${index === selectedAnswer ? "rotate-180" : ""}`}
                    />
                  </div>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      index === selectedAnswer
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
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default FaqPage;

import { ReceiptText } from "lucide-react";

type PaymentDirection = "incoming" | "outgoing";

type PaymentItem = {
  id: string;
  service: string;
  method: string;
  date: string;
  amount: string;
  direction: PaymentDirection;
};

const payments: PaymentItem[] = [
  {
    id: "pay-1",
    service: "Visa consultation",
    method: "Mastercard **** 9918",
    date: "03.07.2026",
    amount: "-20 $",
    direction: "outgoing",
  },
  {
    id: "pay-2",
    service: "Airport transfer booking",
    method: "Mastercard **** 9918",
    date: "02.07.2026",
    amount: "-10 $",
    direction: "outgoing",
  },
  {
    id: "pay-3",
    service: "Hotel selection",
    method: "Mastercard **** 9918",
    date: "30.06.2026",
    amount: "-10 $",
    direction: "outgoing",
  },
  {
    id: "pay-4",
    service: "Personal shopping",
    method: "Mastercard **** 9918",
    date: "28.06.2026",
    amount: "-15 $",
    direction: "outgoing",
  },
  {
    id: "pay-5",
    service: "Private driver",
    method: "Mastercard **** 9918",
    date: "26.06.2026",
    amount: "-10 $",
    direction: "outgoing",
  },
];

function PaymentsPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="app-scroll-area mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto hide-scrollbar py-1">
        <div className="mx-auto flex w-full max-w-2xl flex-col px-0 pb-8">
          <h1 className="text-[2rem] font-light tracking-[-0.04em] text-[var(--color-text-primary)]">
            My Transactions
          </h1>

          <div className="mt-5 space-y-3">
            {payments.map((payment) => {
              const isIncoming = payment.direction === "incoming";

              return (
                <article
                  key={payment.id}
                  className="flex items-center gap-4 rounded-lg bg-[var(--color-surface)] px-4 py-4 shadow-[var(--shadow-card)] transition hover:bg-[var(--color-surface-hover)]"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                      isIncoming
                        ? "bg-[var(--color-positive-soft)] text-[var(--color-positive)]"
                        : "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    <ReceiptText />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[1.02rem] font-medium text-[var(--color-text-primary)]">
                      {payment.service}
                    </h2>
                    <p className="mt-1 truncate text-sm text-[var(--color-text-subtle)]">
                      {payment.method}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div
                      className={`text-[1.02rem] font-medium ${
                        isIncoming
                          ? "text-[var(--color-positive)]"
                          : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {payment.amount}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-faint)]">
                      {payment.date}
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

export default PaymentsPage;

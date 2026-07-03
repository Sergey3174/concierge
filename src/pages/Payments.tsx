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
    amount: "- 12 500 RUB",
    direction: "outgoing" as const,
  },
  {
    id: "pay-2",
    service: "Airport transfer booking",
    method: "Mastercard **** 9918",
    date: "02.07.2026",
    amount: "- 4 800 RUB",
    direction: "outgoing" as const,
  },
  {
    id: "pay-3",
    service: "Hotel подбор",
    method: "Mastercard **** 9918",
    date: "30.06.2026",
    amount: "- 9 900 RUB",
    direction: "outgoing" as const,
  },
  {
    id: "pay-4",
    service: "Personal shopping",
    method: "Mastercard **** 9918",
    date: "28.06.2026",
    amount: "- 15 000 RUB",
    direction: "outgoing" as const,
  },
  {
    id: "pay-5",
    service: "Private driver",
    method: "Mastercard **** 9918",
    date: "26.06.2026",
    amount: "- 7 200 RUB",
    direction: "outgoing" as const,
  },
];

function DirectionIcon({ direction }: { direction: PaymentDirection }) {
  if (direction === "incoming") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 5V19M12 19L7 14M12 19L17 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 19V5M12 5L7 10M12 5L17 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaymentsPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-auto hide-scrollbar py-1">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-[2rem] font-light tracking-[-0.04em] text-white/92">
            My Transactions
          </h1>

          <div className="mt-5 space-y-3">
            {payments.map((payment) => {
              const isIncoming = payment.direction === "incoming";

              return (
                <article
                  key={payment.id}
                  className="flex items-center gap-4 rounded-xl bg-[#1f1f1f] px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition hover:bg-[#252525]"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                      isIncoming
                        ? "bg-emerald-500/12 text-emerald-300"
                        : "bg-white/[0.06] text-white/74"
                    }`}
                  >
                    <DirectionIcon direction={payment.direction} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[1.02rem] font-medium text-white/92">
                      {payment.service}
                    </h2>
                    <p className="mt-1 truncate text-sm text-white/42">
                      {payment.method}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div
                      className={`text-[1.02rem] font-medium ${
                        isIncoming ? "text-emerald-300" : "text-white/92"
                      }`}
                    >
                      {payment.amount}
                    </div>
                    <div className="mt-1 text-sm text-white/34">
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

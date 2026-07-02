import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { DefaultTaskPicker } from "./components/DefaultTaskPicker";
import { MobileDrawer } from "./components/MobileDrawer";
import { SettingsEditorSheet } from "./components/SettingsEditorSheet";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M4 7H20M4 12H16M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 5V19M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GeminiStar() {
  return (
    <div className="relative mx-auto shrink-0 h-12 w-12 rotate-12">
      <div className="absolute inset-0 rounded-[14px] bg-[conic-gradient(from_210deg,#ff6b6b,#ffcf5a,#5ae3a3,#58a6ff,#a78bfa,#ff6b6b)] [clip-path:polygon(50%_0%,65%_35%,100%_50%,65%_65%,50%_100%,35%_65%,0%_50%,35%_35%)] shadow-[0_0_40px_rgba(88,166,255,0.18)]" />
      <div className="absolute inset-[11px] rounded-[8px] bg-black/20 backdrop-blur-[1px] [clip-path:polygon(50%_0%,65%_35%,100%_50%,65%_65%,50%_100%,35%_65%,0%_50%,35%_35%)]" />
    </div>
  );
}

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLElement>(null);
  const [isOpenDefaultTask, setIsOpenDefaultTask] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );

  useEffect(() => {
    const lockViewportScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const setAppHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
      lockViewportScroll();
    };

    setAppHeight();

    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);
    window.addEventListener("resize", setAppHeight);
    window.addEventListener("scroll", lockViewportScroll, { passive: true });

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      window.requestAnimationFrame(() => {
        scrollAreaRef.current?.scrollTo({
          top: scrollAreaRef.current.scrollTop,
          left: 0,
        });
        lockViewportScroll();
      });
    };

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("scroll", lockViewportScroll);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [prompt]);

  const handleSend = () => {
    if (prompt.trim() === "") {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: prompt },
    ]);
    setPrompt("");
  };

  const showMessges = messages?.length > 0;

  return (
    <>
      <div className="app-shell overflow-hidden">
        <div className="relative mx-auto flex h-full w-full flex-col overflow-hidden">
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            openDefaultTask={() => setIsOpenDefaultTask(true)}
          />

          <div
            className={`relative z-20 flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 transition-transform duration-300 ease-out ${
              isDrawerOpen ? "translate-x-[320px]" : "translate-x-0"
            }`}
          >
            <header className="flex items-center justify-between">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition hover:bg-white/8"
              >
                <MenuIcon />
              </button>
            </header>

            <main className="relative flex min-h-0 flex-1 flex-col justify-between">
              <section
                ref={scrollAreaRef}
                className="app-scroll-area relative min-h-0 flex-1 overflow-y-auto"
              >
                {!showMessges ? (
                  <div className="mx-auto flex min-h-full max-w-[280px] flex-col items-center justify-center py-16">
                    {/* <GeminiStar /> */}
                    <h1 className="mt-7 text-center text-[2.15rem] font-light leading-[1.08] tracking-[-0.04em] text-white/92">
                      How can I help you? <br /> Write what you need.
                    </h1>
                  </div>
                ) : (
                  <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-1 py-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`text-white/92 flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <span className="bg-[#1f1f1f] text-md font-medium  px-3 p-3 break-all rounded-[1.5rem] max-w-[60%]">
                          {" "}
                          {message.content}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <footer className="relative mx-auto w-full max-w-3xl">
                <div className="rounded-[2.5rem] bg-[#1f1f1f]/96 px-4 py-3">
                  <div className="flex items-end gap-3">
                    <button
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/78 transition hover:bg-white/8"
                      onClick={() => setIsOpenDefaultTask(true)}
                    >
                      <PlusIcon />
                    </button>

                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      className="max-h-40 min-h-12 flex-1 resize-none overflow-y-auto bg-transparent py-3 text-[1.05rem] leading-6 text-white outline-none placeholder:text-white/45"
                      placeholder="Ask Concierge"
                    />

                    <button
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 disabled:bg-white/10 text-white/55 transition hover:bg-white/15 hover:text-white"
                      onClick={handleSend}
                      disabled={prompt.trim() === ""}
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
      <SettingsEditorSheet
        isOpen={isOpenDefaultTask}
        onClose={() => setIsOpenDefaultTask(false)}
        showHeader={false}
        showCloseButton={false}
        showSaveButtons={false}
        overlayClassName="bg-black/40"
        sheetBaseClassName=""
        sheetClassName="mx-auto w-full max-w-3xl bg-[#1f1f1f] px-4 pb-8 pt-2 shadow-[0_-24px_60px_rgba(0,0,0,0.48)]"
      >
        <DefaultTaskPicker onSelect={() => setIsOpenDefaultTask(false)} />
      </SettingsEditorSheet>
    </>
  );
}

export default App;

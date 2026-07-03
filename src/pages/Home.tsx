import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  addChat,
  addMessageToChat,
  selectCurrentChat,
  selectCurrentChatId,
} from "../store/chatsSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AppLayoutOutletContext } from "../layout/AppLayout";

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

function HomePage() {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { openDefaultTask } = useOutletContext<AppLayoutOutletContext>();
  const currentChat = useSelector((state: RootState) =>
    selectCurrentChat(state),
  );
  const currentChatId = useSelector((state: RootState) =>
    selectCurrentChatId(state),
  );

  const scrollAreaRef = useRef<HTMLElement>(null);

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
    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt === "") {
      return;
    }

    const createdAt = new Date().toISOString();
    const firstMessage = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: trimmedPrompt,
      createdAt,
    };

    if (!currentChatId) {
      const chatId = `chat-${Date.now()}`;

      dispatch(
        addChat({
          id: chatId,
          title: trimmedPrompt,
          preview: trimmedPrompt,
          updatedAt: createdAt,
          messages: [firstMessage],
        }),
      );
      setPrompt("");
      return;
    }

    dispatch(
      addMessageToChat({
        chatId: currentChatId,
        message: firstMessage,
      }),
    );
    setPrompt("");
  };

  const showMessages = (currentChat?.messages.length ?? 0) > 0;

  return (
    <main className="relative flex min-h-0 flex-1 flex-col justify-between pb-12">
      <section
        ref={scrollAreaRef}
        className="app-scroll-area relative min-h-0 flex-1 hide-scrollbar overflow-y-auto pb-12"
      >
        {!showMessages ? (
          <div className="mx-auto flex min-h-full max-w-[280px] flex-col items-center justify-center py-16">
            <h1 className="mt-7 text-center text-[2.15rem] font-light leading-[1.08] tracking-[-0.04em] text-white/92">
              {currentChat
                ? currentChat.title
                : "How can I help you? \nWrite what you need."}
            </h1>
          </div>
        ) : (
          <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-1 py-2">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`text-white/92 flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={` text-md font-medium px-3 p-3 break-words  ${message.role === "user" ? "bg-[#1f1f1f] max-w-[60%] rounded-[1.5rem] " : "py-4"}`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="absolute bottom-5 mx-auto w-full max-w-3xl">
        <div className="rounded-[2.5rem] bg-[#1f1f1f]/96 px-4 py-3">
          <div className="flex items-end gap-3">
            <button
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white/78 transition hover:bg-white/8"
              onClick={() => openDefaultTask()}
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
  );
}

export default HomePage;

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  sendChatwootMessage,
  selectCurrentChat,
  selectCurrentChatId,
} from "../store/chatsSlice";
import type { AppDispatch, RootState } from "../store/store";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { AppLayoutOutletContext } from "../layout/AppLayout";
import { useTranslation } from "react-i18next";
import {
  ArrowUp,
  Download,
  FileText,
  Paperclip,
  Plus,
  ReceiptText,
  X,
} from "lucide-react";
import type { ChatAttachment } from "../mocks/chats";
import LOGO from "../../public/logo.png";

type PendingAttachment = ChatAttachment & {
  file: File;
};

function AttachmentCard({ attachment }: { attachment: ChatAttachment }) {
  const isImage = attachment.type.startsWith("image/");

  if (isImage && attachment.previewUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-[var(--color-surface-muted)]">
        <a href={attachment.previewUrl} target="_blank" rel="noreferrer">
          <img
            src={attachment.previewUrl}
            alt={attachment.name}
            className="max-h-52 w-full object-cover"
          />
        </a>
        <div className="truncate px-3 py-2 text-sm text-[var(--color-text-primary)]">
          {attachment.name}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-muted)] px-3 py-2.5 text-[var(--color-text-primary)]">
      <FileText size={20} className="shrink-0 text-[var(--color-text-muted)]" />
      <span className="min-w-0 flex-1 truncate text-sm">{attachment.name}</span>
      {attachment.previewUrl && (
        <a
          href={attachment.previewUrl}
          download={attachment.name}
          target="_blank"
          rel="noreferrer"
          aria-label={`Download ${attachment.name}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
        >
          <Download size={18} />
        </a>
      )}
    </div>
  );
}

function HomePage() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { openDefaultTask } = useOutletContext<AppLayoutOutletContext>();
  const currentChat = useSelector((state: RootState) =>
    selectCurrentChat(state),
  );
  const currentChatId = useSelector((state: RootState) =>
    selectCurrentChatId(state),
  );
  const chatwootSession = useSelector(
    (state: RootState) => state.authUser.anonymousSession?.chatwoot,
  );
  const sendStatus = useSelector((state: RootState) => state.chats.sendStatus);

  const scrollAreaRef = useRef<HTMLElement>(null);
  const scrollToBottom = () => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      return;
    }

    scrollArea.scrollTo({
      top: scrollArea.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
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
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [prompt]);

  useLayoutEffect(() => {
    window.requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [currentChatId, currentChat?.messages.length]);

  const handleSend = async () => {
    const trimmedPrompt = prompt.trim();

    if (
      (trimmedPrompt === "" && attachments.length === 0) ||
      !chatwootSession
    ) {
      return;
    }

    try {
      await dispatch(
        sendChatwootMessage({
          session: chatwootSession,
          conversationId: currentChatId,
          content: trimmedPrompt,
          files: attachments.map((attachment) => attachment.file),
        }),
      ).unwrap();
      setPrompt("");
      setAttachments([]);
    } catch {
      // The user can retry from the input; the text is kept intact on failure.
    }
  };

  const handleAttachmentChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    const nextAttachments = await Promise.all(
      files.map(
        (file) =>
          new Promise<PendingAttachment>((resolve) => {
            if (!file.type.startsWith("image/")) {
              resolve({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                type: file.type,
                file,
              });
              return;
            }

            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                type: file.type,
                previewUrl: String(reader.result),
                file,
              });
            reader.readAsDataURL(file);
          }),
      ),
    );

    setAttachments((current) => [...current, ...nextAttachments]);
    event.target.value = "";
  };

  const showMessages = (currentChat?.messages.length ?? 0) > 0;
  const paymentRequest =
    currentChat?.status === "payment" ? currentChat.payment : undefined;

  return (
    <main className="relative transition-all flex min-h-0 flex-1 flex-col justify-between pb-[calc(48px+var(--sa-b))]">
      <section
        ref={scrollAreaRef}
        className={`app-scroll-area relative min-h-0 flex-1 hide-scrollbar overflow-y-auto ${paymentRequest ? "pb-40" : "pb-12"}`}
      >
        {!showMessages ? (
          <div className="transition-all mx-auto flex min-h-full max-w-[280px] flex-col items-center justify-center py-16">
            <div className="mx-auto flex size-[6rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
              <img src={LOGO} alt="logo" />
            </div>
            <h1 className="mt-7 text-center text-[2.15rem] font-light leading-[1.08] tracking-[-0.04em] text-[var(--color-text-primary)]">
              {currentChat ? currentChat.title : t("home.emptyState")}
            </h1>
          </div>
        ) : (
          <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-1 py-2">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`text-[var(--color-text-primary)] flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[60%] ${message.role === "user" ? "rounded-lg bg-[var(--color-surface)] p-3" : "py-4"}`}
                >
                  {message.content && (
                    <p className="text-md break-words px-3 font-medium">
                      {message.content}
                    </p>
                  )}
                  {message.attachments?.length ? (
                    <div
                      className={
                        message.content ? "mt-2 space-y-2" : "space-y-2"
                      }
                    >
                      {message.attachments.map((attachment) => (
                        <AttachmentCard
                          key={attachment.id}
                          attachment={attachment}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="absolute bottom-[calc(12px+var(--sa-b))] mx-auto w-full max-w-3xl left-1/2 -translate-x-1/2">
        {paymentRequest ? (
          <div className="mb-3 mt-5 w-full">
            <div className="w-full rounded-lg bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)]">
              <div className="flex items-center gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]">
                  <ReceiptText className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[1rem] font-medium text-[var(--color-text-primary)]">
                    {paymentRequest.name || t("home.waitingForPayment")}
                  </h2>
                  {paymentRequest.description && (
                    <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                      {paymentRequest.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mx-auto mt-2 flex w-full  items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)]"
              onClick={() => navigate("/payment")}
            >
              {t("home.pay", { amount: paymentRequest.amountLabel })}
            </button>
          </div>
        ) : null}
        <div className="rounded-lg bg-[var(--color-surface-translucent)] px-4 py-3">
          {attachments.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="relative flex items-center w-48 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] p-1"
                >
                  <div className="flex h-8  items-center justify-center">
                    {attachment.previewUrl ? (
                      <img
                        src={attachment.previewUrl}
                        alt={attachment.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText size={24} />
                    )}
                  </div>
                  <div className="truncate px-2 py-1 text-xs text-[var(--color-text-primary)]">
                    {attachment.name}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter((item) => item.id !== attachment.id),
                      )
                    }
                    className="rounded-full bg-[var(--color-surface)] p-0.5 text-[var(--color-text-primary)]"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-3">
            <div className="flex items-center h-12 gap-2">
              <button
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-soft)]"
                onClick={() => openDefaultTask()}
              >
                <Plus className="size-6" />
              </button>
              <button
                type="button"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-soft)]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              className="hidden"
              onChange={handleAttachmentChange}
            />

            <div className="relative min-w-0 flex-1">
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                aria-label={t("home.askPlaceholder")}
                className="block max-h-40 min-h-12 w-full resize-none overflow-x-hidden overflow-y-auto bg-transparent py-3 text-[1.05rem] leading-6 text-[var(--color-accent-contrast)] outline-none"
              />
              {!prompt && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-3 truncate text-[1.05rem] leading-6 text-[var(--color-text-soft)]"
                >
                  {t("home.askPlaceholder")}
                </span>
              )}
            </div>

            <button
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-surface-disabled)] disabled:text-[var(--color-text-soft)]"
              onClick={handleSend}
              disabled={
                prompt.trim() === "" ||
                !chatwootSession ||
                sendStatus === "loading"
              }
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;

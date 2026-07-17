import { Download, Plus, Share } from "lucide-react";
import { useEffect, useState } from "react";
import LOGO from "../../public/logo.png";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIosDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent);
}

function hasKnownPwaInstallation() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function WelcomePage() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(hasKnownPwaInstallation);
  const iosDevice = isIosDevice();
  const androidDevice = isAndroidDevice();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setIsPwaInstalled(false);
    };
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handlePwaInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setIsPwaInstalled(true);
    }

    setInstallPrompt(null);
  };

  const handlePwaAction = () => {
    if (isPwaInstalled) {
      window.open(`${window.location.origin}/`, "_blank", "noopener");
      return;
    }

    void handlePwaInstall();
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-12 text-[var(--color-text-primary)] sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(ellipse_at_bottom,rgba(153,143,0,0.24),transparent_68%)]" />

      <section className="relative z-10 w-full max-w-md text-center">
        <div className="mx-auto flex size-[4.5rem] items-center justify-center rounded-3xl bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
          <img src={LOGO} alt="logo" />
        </div>

        <h1 className="mt-8 text-4xl font-medium tracking-tight">Concierge</h1>
        {/* <p className="mx-auto mt-4 max-w-sm text-[1.05rem] leading-7 text-[var(--color-text-muted)]">
          Установите приложение, чтобы всегда иметь консьерж-сервис под рукой.
        </p> */}

        <div className="mt-10 space-y-4 text-left">
          {iosDevice && (
            <div className="rounded-2xl bg-[var(--color-surface-muted)] px-5 py-5 text-[0.95rem] leading-6 text-[var(--color-text-secondary)]">
              <p className="font-medium text-[var(--color-text-primary)]">
                Как установить на iPhone или iPad
              </p>
              <ol className="mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-xs">
                    1
                  </span>
                  Нажмите <Share className="size-4" /> «Поделиться».
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-xs">
                    2
                  </span>
                  Выберите <Plus className="size-4" /> «На экран Домой».
                </li>
              </ol>
            </div>
          )}

          <button
            type="button"
            onClick={handlePwaAction}
            disabled={!isPwaInstalled && !installPrompt && !iosDevice}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-accent-contrast)] transition hover:bg-[var(--color-accent-hover)] disabled:cursor-default disabled:opacity-55"
          >
            <Download size={19} />
            {isPwaInstalled ? "Открыть приложение" : "Установить PWA"}
          </button>

          {androidDevice && (
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-surface-disabled)] px-5 py-4 text-[1.05rem] font-medium text-[var(--color-text-muted)] opacity-60"
            >
              <Download size={19} />
              Скачать APK
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SHEET_ANIMATION_MS = 300;

type SettingsEditorSheetProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  disabled?: boolean;
  showSaveButtons?: boolean;
  showCloseButton?: boolean;
  showHeader?: boolean;
  overlayClassName?: string;
  sheetClassName?: string;
  sheetBaseClassName?: string;
};

export function SettingsEditorSheet({
  isOpen,
  title = "Edit setting",
  description,
  children,
  onClose,
  onSave,
  disabled = false,
  showSaveButtons = true,
  showCloseButton = true,
  showHeader = true,
  overlayClassName = "",
  sheetClassName = "",
  sheetBaseClassName = "bg-[var(--color-surface)] px-5 pb-8 pt-4 shadow-[var(--shadow-sheet)]",
}: SettingsEditorSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    setIsVisible(false);

    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
    }, SHEET_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) {
      setIsVisible(false);
      return;
    }

    if (!isOpen) {
      return;
    }

    let secondFrameId = 0;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-20 bg-[var(--color-overlay-strong)] transition-opacity duration-300 ${
          isVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } ${overlayClassName}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-30 rounded-t-2xl transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } ${sheetBaseClassName} ${sheetClassName}`}
      >
        {showHeader && (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="rounded-full bg-[var(--color-surface-soft)] p-2 text-[var(--color-text-muted)]"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {children}

        {showSaveButtons && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-2xl border border-[var(--color-surface-disabled)] px-4 py-3 font-semibold text-[var(--color-text-muted)]"
              onClick={onClose}
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`flex-1 rounded-2xl bg-[var(--color-accent)] px-4 py-3 font-semibold text-[var(--color-accent-contrast)] shadow-[var(--shadow-card)] ${disabled ? "opacity-40" : ""}`}
              onClick={onSave}
              disabled={disabled}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────

const MODAL_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

const OVERLAY_TRANSITION = { duration: 0.18, ease: "easeOut" as const };

// ── Size presets ─────────────────────────────────────────────────────

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[520px]",
  lg: "max-w-[640px]",
  xl: "max-w-[800px]",
  full: "max-w-[calc(100vw-48px)]",
};

// ── Body scroll lock ─────────────────────────────────────────────────

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

// ── Focus trap ───────────────────────────────────────────────────────

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;

    // Focus first focusable element
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) {
      requestAnimationFrame(() => focusable[0].focus());
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [ref, active]);
}

// ── Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Size preset — defaults to "md" */
  size?: ModalSize;
  /** Custom max-width class (overrides size) */
  maxWidth?: string;
  /** Additional classes on the card */
  className?: string;
  /** Show close button — defaults to true */
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  maxWidth,
  className,
  showClose = true,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useBodyScrollLock(open);
  useFocusTrap(cardRef, open);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={OVERLAY_TRANSITION}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-neutral-100/50 backdrop-blur-md dark:bg-neutral-900/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_TRANSITION}
          />

          {/* Card */}
          <motion.div
            ref={cardRef}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-t-[20px] border border-border bg-card-bg shadow-xl sm:rounded-[20px]",
              "max-h-[90vh]",
              maxWidth ?? sizeClasses[size],
              className,
            )}
            initial={{ opacity: 0, scale: 0.96, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: 6, filter: "blur(2px)" }}
            transition={MODAL_SPRING}
            onClick={(e) => e.stopPropagation()}
          >
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3L9 9M9 3L3 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ── Sub-components ───────────────────────────────────────────────────

export function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Dropdown animation helper (preserved for existing usage) ─────────

interface DropdownAnimationProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

const SLIDE_OFFSETS = {
  top: { y: 2, x: 0 },
  bottom: { y: -2, x: 0 },
  left: { y: 0, x: 2 },
  right: { y: 0, x: -2 },
} as const;

export function DropdownAnimation({
  open,
  children,
  className,
  side = "bottom",
}: DropdownAnimationProps) {
  const dir = SLIDE_OFFSETS[side];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={className}
          initial={{ opacity: 0, x: dir.x, y: dir.y }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: dir.x, y: dir.y }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

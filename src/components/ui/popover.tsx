"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
  FloatingPortal,
  FloatingFocusManager,
  type Placement,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Context ──────────────────────────────────────────────────────────

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  refs: ReturnType<typeof useFloating>["refs"];
  floatingStyles: ReturnType<typeof useFloating>["floatingStyles"];
  getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"];
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  context: ReturnType<typeof useFloating>["context"];
  actualPlacement: Placement;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within <Popover>");
  return ctx;
}

// ── Root ─────────────────────────────────────────────────────────────

interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offsetPx?: number;
}

function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom-start",
  offsetPx = 6,
}: PopoverRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const {
    refs,
    floatingStyles,
    context,
    placement: actualPlacement,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [
      offset(offsetPx),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      sizeMiddleware({
        padding: 8,
        apply({ availableHeight, elements }) {
          elements.floating.style.maxHeight = `${availableHeight}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      context,
      actualPlacement,
    }),
    [
      open,
      setOpen,
      refs,
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      context,
      actualPlacement,
    ],
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

// ── Trigger ──────────────────────────────────────────────────────────

interface PopoverTriggerProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const { refs, getReferenceProps } = usePopoverContext();

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps()}
      className={cn("inline-flex w-fit", className)}
    >
      {children}
    </div>
  );
}
PopoverTrigger.displayName = "PopoverTrigger";

// ── Content ──────────────────────────────────────────────────────────

const SLIDE_PX = 3;

function slideOffset(placement: Placement) {
  if (placement.startsWith("top")) return { y: SLIDE_PX };
  if (placement.startsWith("bottom")) return { y: -SLIDE_PX };
  if (placement.startsWith("left")) return { x: SLIDE_PX };
  return { x: -SLIDE_PX };
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  matchTriggerWidth?: boolean;
  /** @deprecated use Popover placement prop instead */
  align?: string;
  /** @deprecated use Popover offsetPx prop instead */
  sideOffset?: number;
  /** @deprecated use Popover placement prop instead */
  side?: string;
  collisionPadding?: number | Partial<Record<string, number>>;
}

function PopoverContent({
  children,
  className,
  matchTriggerWidth,
}: PopoverContentProps) {
  const { open, refs, floatingStyles, getFloatingProps, context, actualPlacement } =
    usePopoverContext();

  const dir = slideOffset(actualPlacement);
  const triggerW = refs.reference.current
    ? (refs.reference.current as HTMLElement).offsetWidth
    : undefined;

  return (
    <FloatingPortal>
      <AnimatePresence>
        {open && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                ...(matchTriggerWidth && triggerW
                  ? { minWidth: triggerW }
                  : {}),
              }}
              {...getFloatingProps()}
              className="z-50 outline-none"
            >
              <motion.div
                className={cn(
                  "overflow-hidden overflow-y-auto rounded-2xl border border-border bg-card-bg p-1 shadow-lg",
                  className,
                )}
                initial={{ opacity: 0, ...dir, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, ...dir, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </div>
          </FloatingFocusManager>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}
PopoverContent.displayName = "PopoverContent";

// ── Close helper ─────────────────────────────────────────────────────

function PopoverClose({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

// ── Exports ──────────────────────────────────────────────────────────

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, usePopoverContext };

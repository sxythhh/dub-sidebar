"use client";

import {
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { useProximityHover } from "@/hooks/use-proximity-hover";

// ── Context ──

interface FluidTableContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
}

const FluidTableContext = createContext<FluidTableContextValue | null>(null);

// ── Table ──

interface FluidTableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

const FluidTable = forwardRef<HTMLTableElement, FluidTableProps>(
  ({ children, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      activeIndex,
      itemRects,
      sessionRef,
      handlers,
      registerItem,
      measureItems,
    } = useProximityHover(containerRef);

    useEffect(() => {
      measureItems();
    }, [measureItems, children]);

    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

    return (
      <FluidTableContext.Provider value={{ registerItem, activeIndex }}>
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute rounded-lg bg-[var(--ap-hover)]"
                initial={{
                  opacity: 0,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                animate={{
                  opacity: 1,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{
                  ...springs.moderate,
                  opacity: { duration: 0.16 },
                }}
              />
            )}
          </AnimatePresence>

          <table
            ref={ref}
            className={cn(
              "w-full border-collapse font-inter text-[13px]",
              className,
            )}
            {...props}
          >
            {children}
          </table>
        </div>
      </FluidTableContext.Provider>
    );
  },
);

FluidTable.displayName = "FluidTable";

// ── TableHeader ──

const FluidTableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("", className)} {...props} />
));

FluidTableHeader.displayName = "FluidTableHeader";

// ── TableBody ──

const FluidTableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));

FluidTableBody.displayName = "FluidTableBody";

// ── TableRow ──

interface FluidTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  index?: number;
}

const FluidTableRow = forwardRef<HTMLTableRowElement, FluidTableRowProps>(
  ({ index, className, style, ...props }, ref) => {
    const internalRef = useRef<HTMLTableRowElement>(null);
    const ctx = useContext(FluidTableContext);

    useEffect(() => {
      if (index === undefined || !ctx) return;
      ctx.registerItem(index, internalRef.current);
      return () => ctx.registerItem(index, null);
    }, [index, ctx]);

    const isBodyRow = index !== undefined;
    const activeIdx = ctx?.activeIndex ?? null;
    const hideBorder =
      activeIdx !== null &&
      ((isBodyRow && (index === activeIdx || index === activeIdx - 1)) ||
        (!isBodyRow && activeIdx === 0));

    return (
      <tr
        ref={(node) => {
          (
            internalRef as React.MutableRefObject<HTMLTableRowElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (
              ref as React.MutableRefObject<HTMLTableRowElement | null>
            ).current = node;
        }}
        data-proximity-index={index}
        className={cn(
          "group/row relative z-10 border-b transition-[border-color] duration-75",
          hideBorder
            ? "border-transparent"
            : "border-[var(--ap-border)]",
          isBodyRow && activeIdx === index && "is-active",
          className,
        )}
        style={style}
        {...props}
      />
    );
  },
);

FluidTableRow.displayName = "FluidTableRow";

// ── TableHead ──

const FluidTableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-3 py-2 text-left font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]",
      className,
    )}
    {...props}
  />
));

FluidTableHead.displayName = "FluidTableHead";

// ── TableCell ──

const FluidTableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-3 py-2.5 font-inter text-[14px] leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-secondary)] transition-colors duration-75 group-[.is-active]/row:text-[var(--ap-text)]",
      className,
    )}
    {...props}
  />
));

FluidTableCell.displayName = "FluidTableCell";

export {
  FluidTable,
  FluidTableHeader,
  FluidTableBody,
  FluidTableRow,
  FluidTableHead,
  FluidTableCell,
};

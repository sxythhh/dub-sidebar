"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  useId,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { fontWeights } from "@/lib/font-weight";
import { useProximityHover } from "@/hooks/use-proximity-hover";

// ── Subtle Tab primitives ───────────────────────────────────────────

interface TabContextValue {
  registerTab: (index: number, element: HTMLElement | null) => void;
  hoveredIndex: number | null;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within Tabs");
  return ctx;
}

const Tabs = forwardRef<
  HTMLDivElement,
  Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    children: ReactNode;
    selectedIndex: number;
    onSelect: (index: number) => void;
  }
>(({ children, selectedIndex, onSelect, className, ...props }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseInside = useRef(false);

  const {
    activeIndex: hoveredIndex,
    setActiveIndex: setHoveredIndex,
    itemRects: tabRects,
    handlers,
    registerItem: registerTab,
    measureItems: measureTabs,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => {
    measureTabs();
  }, [measureTabs, children]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      isMouseInside.current = true;
      handlers.onMouseMove(e);
    },
    [handlers],
  );

  const handleMouseLeave = useCallback(() => {
    isMouseInside.current = false;
    handlers.onMouseLeave();
  }, [handlers]);

  const selectedRect = tabRects[selectedIndex];
  const hoverRect = hoveredIndex !== null ? tabRects[hoveredIndex] : null;
  const isHoveringSelected = hoveredIndex === selectedIndex;
  const isHovering = hoveredIndex !== null && !isHoveringSelected;

  return (
    <TabContext.Provider
      value={{ registerTab, hoveredIndex, selectedIndex, onSelect }}
    >
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (
              ref as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative flex items-center gap-0.5 rounded-2xl bg-accent p-0.5 select-none",
          className,
        )}
        role="tablist"
        {...props}
      >
        {/* Selected pill */}
        {selectedRect && (
          <motion.div
            className="pointer-events-none absolute rounded-xl bg-card-bg shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-white/[0.10] dark:shadow-none"
            initial={false}
            animate={{
              left: selectedRect.left,
              width: selectedRect.width,
              top: selectedRect.top,
              height: selectedRect.height,
              opacity: isHovering ? 0.85 : 1,
            }}
            transition={{
              ...springs.moderate,
              opacity: { duration: 0.16 },
            }}
          />
        )}

        {/* Hover pill */}
        <AnimatePresence>
          {hoverRect && !isHoveringSelected && selectedRect && (
            <motion.div
              className="pointer-events-none absolute rounded-xl bg-accent dark:bg-white/[0.06]"
              initial={{
                left: selectedRect.left,
                width: selectedRect.width,
                top: selectedRect.top,
                height: selectedRect.height,
                opacity: 0,
              }}
              animate={{
                left: hoverRect.left,
                width: hoverRect.width,
                top: hoverRect.top,
                height: hoverRect.height,
                opacity: 1,
              }}
              exit={
                !isMouseInside.current && selectedRect
                  ? {
                      left: selectedRect.left,
                      width: selectedRect.width,
                      top: selectedRect.top,
                      height: selectedRect.height,
                      opacity: 0,
                      transition: {
                        ...springs.moderate,
                        opacity: { duration: 0.12 },
                      },
                    }
                  : { opacity: 0, transition: { duration: 0.12 } }
              }
              transition={{
                ...springs.moderate,
                opacity: { duration: 0.16 },
              }}
            />
          )}
        </AnimatePresence>

        {children}
      </div>
    </TabContext.Provider>
  );
});
Tabs.displayName = "Tabs";

const TabItem = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    label: string;
    count: number;
    index: number;
  }
>(({ label, count, index, className, ...props }, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const { registerTab, hoveredIndex, selectedIndex, onSelect } = useTab();

  useEffect(() => {
    registerTab(index, internalRef.current);
    return () => registerTab(index, null);
  }, [index, registerTab]);

  const isSelected = selectedIndex === index;
  const isHovered = hoveredIndex === index;

  return (
    <button
      ref={(node) => {
        (
          internalRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (
            ref as React.MutableRefObject<HTMLButtonElement | null>
          ).current = node;
      }}
      data-proximity-index={index}
      role="tab"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(index)}
      className={cn(
        "relative z-10 flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border-none bg-transparent px-4 font-[family-name:var(--font-inter)] tracking-[-0.02em] outline-none",
        className,
      )}
      {...props}
    >
      <span className="inline-grid text-sm">
        <span
          className="invisible col-start-1 row-start-1"
          style={{ fontVariationSettings: fontWeights.semibold }}
          aria-hidden="true"
        >
          {label}
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 transition-[color,font-variation-settings] duration-75",
            isSelected || isHovered
              ? "text-page-text"
              : "text-page-text-subtle",
          )}
          style={{
            fontVariationSettings: isSelected
              ? fontWeights.semibold
              : fontWeights.medium,
          }}
        >
          {label}
        </span>
      </span>
      <span className="text-sm font-normal text-page-text-muted">
        {count}
      </span>
    </button>
  );
});
TabItem.displayName = "TabItem";

// ── Filter Icon ─────────────────────────────────────────────────────

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 0.75H12.75M4.75 10.0833H8.75M2.75 5.41667H10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

const TABS = [
  { name: "All", count: 21 },
  { name: "Pending", count: 8 },
  { name: "Approved", count: 5 },
  { name: "Rejected", count: 5 },
  { name: "Flagged", count: 3 },
];


export default function SubmissionsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Submissions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-1.5 rounded-full px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-accent">
            Understanding scores &amp; matches
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
          </button>

          <button className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-accent">
            Export
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.667V10M8 2.667L5.333 5.333M8 2.667L10.667 5.333M2.667 10.667V12C2.667 12.736 3.264 13.333 4 13.333H12C12.736 13.333 13.333 12.736 13.333 12V10.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-[21px] sm:px-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
        {/* Tabs */}
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="scrollbar-hide overflow-x-auto">
          {TABS.map((tab, i) => (
            <TabItem
              key={tab.name}
              label={tab.name}
              count={tab.count}
              index={i}
            />
          ))}
        </Tabs>

        {/* Search + Filter */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card-bg px-3 md:w-[300px] md:flex-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0 text-page-text-subtle"
            >
              <path
                d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
            />
          </div>

          <button className="flex size-9 items-center justify-center rounded-2xl bg-accent text-page-text transition-colors hover:bg-accent">
            <FilterIcon />
          </button>
        </div>
      </div>

      </div>
    </div>
  );
}

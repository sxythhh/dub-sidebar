"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { fontWeights } from "@/lib/font-weight";
import { useProximityHover } from "@/hooks/use-proximity-hover";

// ── Context ──────────────────────────────────────────────────────────

type TabVariant = "contained" | "underline";

interface TabContextValue {
  registerTab: (index: number, element: HTMLElement | null) => void;
  hoveredIndex: number | null;
  selectedIndex: number;
  onSelect: (index: number) => void;
  variant: TabVariant;
}

const TabContext = createContext<TabContextValue | null>(null);

export function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within Tabs");
  return ctx;
}

// ── Tabs Container ───────────────────────────────────────────────────

export const Tabs = forwardRef<
  HTMLDivElement,
  Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
    children: ReactNode;
    selectedIndex: number;
    onSelect: (index: number) => void;
    /** Visual style — "contained" (pill bg) or "underline" (bottom border) */
    variant?: TabVariant;
  }
>(
  (
    {
      children,
      selectedIndex,
      onSelect,
      variant = "contained",
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMouseInside = useRef(false);

    const {
      activeIndex: hoveredIndex,
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

    const isContained = variant === "contained";
    const isUnderline = variant === "underline";

    return (
      <TabContext.Provider
        value={{ registerTab, hoveredIndex, selectedIndex, onSelect, variant }}
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
            "relative flex items-center select-none",
            isContained && "w-fit gap-0.5 rounded-2xl bg-accent p-0.5",
            isUnderline && "gap-0 border-b border-border",
            className,
          )}
          role="tablist"
          {...props}
        >
          {/* Contained: selected pill background */}
          {isContained && selectedRect && (
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

          {/* Contained: hover pill */}
          {isContained && (
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
          )}

          {/* Underline: active indicator bar */}
          {isUnderline && selectedRect && (
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-page-text"
              initial={false}
              animate={{
                left: selectedRect.left,
                width: selectedRect.width,
                opacity: isHovering ? 0.5 : 1,
              }}
              transition={{
                ...springs.moderate,
                opacity: { duration: 0.16 },
              }}
            />
          )}

          {/* Underline: hover indicator */}
          {isUnderline && (
            <AnimatePresence>
              {hoverRect && !isHoveringSelected && selectedRect && (
                <motion.div
                  className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full bg-page-text-muted"
                  initial={{
                    left: selectedRect.left,
                    width: selectedRect.width,
                    opacity: 0,
                  }}
                  animate={{
                    left: hoverRect.left,
                    width: hoverRect.width,
                    opacity: 0.5,
                  }}
                  exit={
                    !isMouseInside.current && selectedRect
                      ? {
                          left: selectedRect.left,
                          width: selectedRect.width,
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
          )}

          {children}
        </div>
      </TabContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

// ── Tab Item ─────────────────────────────────────────────────────────

export const TabItem = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & {
    label: string;
    count?: number;
    index: number;
    /** Optional icon to show before label */
    icon?: React.ReactNode;
  }
>(({ label, count, index, icon, className, ...props }, ref) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const { registerTab, hoveredIndex, selectedIndex, onSelect, variant } =
    useTab();

  useEffect(() => {
    registerTab(index, internalRef.current);
    return () => registerTab(index, null);
  }, [index, registerTab]);

  const isSelected = selectedIndex === index;
  const isHovered = hoveredIndex === index;
  const isContained = variant === "contained";
  const isUnderline = variant === "underline";

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
        "relative z-10 flex cursor-pointer items-center border-none bg-transparent font-[family-name:var(--font-inter)] tracking-[-0.02em] outline-none",
        isContained && "h-8 gap-1.5 rounded-xl px-4",
        isUnderline && "h-10 gap-1.5 px-3",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "transition-colors duration-75 [&_svg]:size-4",
            isSelected || isHovered
              ? "text-page-text"
              : "text-page-text-subtle",
          )}
        >
          {icon}
        </span>
      )}
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
            isSelected || isHovered ? "text-page-text" : "text-page-text-subtle",
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
      {count != null && (
        <span
          className={cn(
            "text-sm font-normal transition-colors duration-75",
            isSelected ? "text-page-text-muted" : "text-page-text-subtle",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
});
TabItem.displayName = "TabItem";

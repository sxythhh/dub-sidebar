"use client";

import { useRef, useEffect, forwardRef, type HTMLAttributes } from "react";
import type { TablerIcon } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useDropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { fontWeights } from "@/lib/font-weight";

interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  icon: TablerIcon;
  label: string;
  index: number;
  checked?: boolean;
  onSelect?: () => void;
}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  (
    { icon: Icon, label, index, checked, onSelect, className, ...props },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);
    const { registerItem, activeIndex, checkedIndex } = useDropdown();

    useEffect(() => {
      registerItem(index, internalRef.current);
      return () => registerItem(index, null);
    }, [index, registerItem]);

    useEffect(() => {
      hasMounted.current = true;
    }, []);

    const isActive = activeIndex === index;
    const skipAnimation = !hasMounted.current;

    return (
      <div
        ref={(node) => {
          (
            internalRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        data-proximity-index={index}
        tabIndex={index === (checkedIndex ?? 0) ? 0 : -1}
        role="menuitemradio"
        aria-checked={!!checked}
        aria-label={label}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onSelect?.();
          }
        }}
        className={cn(
          "relative z-10 flex cursor-pointer items-center gap-2.5 rounded-xl px-[10px] py-2 font-[family-name:var(--font-inter)] tracking-[-0.02em] outline-none",
          className,
        )}
        {...props}
      >
        <Icon
          size={16}
          stroke={isActive || checked ? 2 : 1.5}
          className={cn(
            "transition-[color,stroke-width] duration-75",
            isActive || checked ? "text-dropdown-text" : "text-dropdown-text-muted",
          )}
        />
        <span className="inline-grid flex-1 text-sm font-medium">
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
              isActive || checked ? "text-dropdown-text" : "text-dropdown-text-muted",
            )}
            style={{
              fontVariationSettings: checked
                ? fontWeights.semibold
                : fontWeights.medium,
            }}
          >
            {label}
          </span>
        </span>
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-dropdown-text"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            >
              <motion.path
                d="M4 12L9 17L20 6"
                initial={{ pathLength: skipAnimation ? 1 : 0 }}
                animate={{
                  pathLength: 1,
                  transition: { duration: 0.08, ease: "easeOut" },
                }}
                exit={{
                  pathLength: 0,
                  transition: { duration: 0.04, ease: "easeOut" },
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

MenuItem.displayName = "MenuItem";

export { MenuItem };
export default MenuItem;

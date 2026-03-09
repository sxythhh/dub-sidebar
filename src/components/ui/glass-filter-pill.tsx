"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import SortIcon from "@/assets/icons/sort.svg";
import { useDropdownExit } from "@/hooks/useDropdownExit";
import { cn } from "@/lib/utils";

/* ── Shared pill trigger ── */

const PILL_TRANSITION =
  "transition-[transform,background,box-shadow,border-color] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)]";

function PillTrigger({
  children,
  open,
  exiting,
  variant,
  active,
  className,
  onClick,
  triggerRef,
}: {
  children: React.ReactNode;
  open: boolean;
  exiting: boolean;
  variant: "filled" | "outline";
  active: boolean;
  className?: string;
  onClick: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      className={cn(
        "flex items-center h-9 rounded-full pl-3 pr-2.5 gap-2 cursor-pointer active:scale-[0.95]",
        PILL_TRANSITION,
        variant === "outline"
          ? active
            ? "discover-outline-pill-active"
            : "discover-outline-pill"
          : "discover-filter-pill",
        className,
      )}
      onClick={onClick}
      ref={triggerRef}
      type="button"
    >
      <span className="text-sm font-normal leading-[1.2] tracking-[-0.09px] text-black/72 dark:text-white/72 whitespace-nowrap">
        {children}
      </span>
      <ChevronDown
        className={cn(
          "shrink-0 text-black/72 dark:text-white/72 transition-transform duration-200",
          open && !exiting && "rotate-180",
        )}
        size={16}
      />
    </button>
  );
}

/* ── Shared dropdown panel ── */

function DropdownPanel({
  children,
  menuRef,
  pos,
  exiting,
  width = 256,
}: {
  children: React.ReactNode;
  menuRef: React.RefObject<HTMLDivElement | null>;
  pos: { top: number; left: number };
  exiting: boolean;
  width?: number;
}) {
  return createPortal(
    <div
      className={cn(
        "fixed z-[9999] rounded-2xl flex flex-col discover-sort-dropdown origin-top",
        exiting
          ? "dropdown-exit-anim"
          : "animate-[dropdown-enter_150ms_cubic-bezier(0.165,0.84,0.44,1)]",
      )}
      ref={menuRef}
      style={{ left: pos.left, top: pos.top, width }}
    >
      {children}
    </div>,
    document.body,
  );
}

/* ── Positioning + outside-click hook ── */

function useDropdownPosition(
  triggerRef: React.RefObject<HTMLElement | null>,
  menuWidth: number,
) {
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 8);
    setPos({ left, top: rect.bottom + 8 });
  }, [triggerRef, menuWidth]);

  return { pos, updatePos };
}

function useOutsideClose(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
  close: () => void,
  updatePos: () => void,
  onOutsideClick?: () => void,
) {
  useEffect(() => {
    if (!open) return;
    updatePos();
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      onOutsideClick?.();
      close();
    }
    function handleScroll() {
      updatePos();
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, triggerRef, menuRef, close, updatePos, onOutsideClick]);
}

/* ── GlassFilterPill (single-select dropdown) ── */

interface GlassFilterPillProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  variant?: "filled" | "outline";
}

function GlassFilterPill({
  label,
  options,
  value,
  onChange,
  variant = "filled",
}: GlassFilterPillProps) {
  const { open, setOpen, exiting, close, isVisible } = useDropdownExit();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pos, updatePos } = useDropdownPosition(triggerRef, 256);

  useOutsideClose(open, triggerRef, menuRef, close, updatePos);

  const display = value === options[0] ? label : value;
  const active = value !== options[0] && !!value;

  const toggle = () => {
    if (exiting) return;
    if (open) close();
    else {
      updatePos();
      setOpen(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <PillTrigger
        active={active}
        exiting={exiting}
        onClick={toggle}
        open={open}
        triggerRef={triggerRef}
        variant={variant}
      >
        {display || label}
      </PillTrigger>
      {isVisible && (
        <DropdownPanel exiting={exiting} menuRef={menuRef} pos={pos}>
          <div className="flex flex-col gap-0.5 p-1">
            {options.map((opt) => {
              const isSelected =
                value === opt || (!value && opt === options[0]);
              return (
                <button
                  className={cn(
                    "flex items-center justify-between w-full h-9 px-3 rounded-xl text-sm font-medium leading-5 tracking-[0.01em] cursor-pointer transition-colors whitespace-nowrap",
                    isSelected
                      ? "discover-sort-item-selected text-black dark:text-white"
                      : "text-neutral-500 hover:bg-black/[0.03] dark:text-white dark:hover:bg-white/[0.03]",
                  )}
                  key={opt}
                  onClick={() => {
                    onChange(opt === options[0] ? "" : opt);
                    close();
                  }}
                  type="button"
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircleIcon className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

/* ── GlassBudgetPill (min/max range dropdown) ── */

interface BudgetRange {
  min: string;
  max: string;
}

interface GlassBudgetPillProps {
  label: string;
  value: BudgetRange;
  onChange: (range: BudgetRange) => void;
  variant?: "filled" | "outline";
}

function formatBudgetDisplay(range: BudgetRange): string {
  if (!range.min && !range.max) return "";
  if (range.min && !range.max) return `$${range.min}+`;
  if (!range.min && range.max) return `Up to $${range.max}`;
  return `$${range.min}–$${range.max}`;
}

function GlassBudgetPill({
  label,
  value,
  onChange,
  variant = "filled",
}: GlassBudgetPillProps) {
  const { open, setOpen, exiting, close, isVisible } = useDropdownExit();
  const [draftMin, setDraftMin] = useState(value.min);
  const [draftMax, setDraftMax] = useState(value.max);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const { pos, updatePos } = useDropdownPosition(triggerRef, 264);

  useEffect(() => {
    if (open) {
      setDraftMin(value.min);
      setDraftMax(value.max);
      updatePos();
      setTimeout(() => minInputRef.current?.focus(), 0);
    }
  }, [open, value, updatePos]);

  const commitAndClose = useCallback(() => {
    onChange({ max: draftMax, min: draftMin });
  }, [onChange, draftMin, draftMax]);

  useOutsideClose(open, triggerRef, menuRef, close, updatePos, commitAndClose);

  const display = formatBudgetDisplay(value);
  const active = !!(value.min || value.max);

  const toggle = () => {
    if (exiting) return;
    if (open) close();
    else {
      updatePos();
      setOpen(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <PillTrigger
        active={active}
        exiting={exiting}
        onClick={toggle}
        open={open}
        triggerRef={triggerRef}
        variant={variant}
      >
        {display || label}
      </PillTrigger>
      {isVisible && (
        <DropdownPanel
          exiting={exiting}
          menuRef={menuRef}
          pos={pos}
          width={264}
        >
          <div className="flex items-center gap-2 p-2">
            <BudgetInput
              onChange={setDraftMin}
              placeholder="$0"
              ref={minInputRef}
              suffix="Min"
              value={draftMin}
            />
            <BudgetInput
              onChange={setDraftMax}
              placeholder="$10,000"
              suffix="Max"
              value={draftMax}
            />
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

/* ── GlassSortPill (icon-only sort trigger) ── */

interface GlassSortPillProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: { label: string; value: T }[];
  defaultValue: T;
  header?: string;
}

function GlassSortPill<T extends string>({
  value,
  onChange,
  options,
  defaultValue,
  header = "Sort by",
}: GlassSortPillProps<T>) {
  const { open, setOpen, exiting, close, isVisible } = useDropdownExit();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pos, updatePos } = useDropdownPosition(triggerRef, 256);

  useOutsideClose(open, triggerRef, menuRef, close, updatePos);

  const toggle = () => {
    if (exiting) return;
    if (open) close();
    else {
      updatePos();
      setOpen(true);
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        className={cn(
          "flex items-center justify-center size-9 rounded-full cursor-pointer active:scale-[0.95]",
          PILL_TRANSITION,
          value !== defaultValue
            ? "discover-outline-pill-active"
            : "discover-outline-pill",
        )}
        onClick={toggle}
        ref={triggerRef}
        type="button"
      >
        <SortIcon />
      </button>
      {isVisible && (
        <DropdownPanel exiting={exiting} menuRef={menuRef} pos={pos}>
          <div className="px-4 pt-4 pb-1">
            <span className="text-xs font-normal leading-[1.2] text-black/56 dark:text-white/56">
              {header}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 px-1 pb-1">
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  className={cn(
                    "flex items-center justify-between h-9 px-3 rounded-xl text-sm font-medium leading-5 tracking-[0.01em] cursor-pointer transition-colors whitespace-nowrap text-black dark:text-white",
                    selected
                      ? "discover-sort-item-selected"
                      : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]",
                  )}
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  type="button"
                >
                  <span>{opt.label}</span>
                  {selected && <CheckCircleIcon />}
                </button>
              );
            })}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

/* ── Shared icons ── */

/* ── Budget input ── */

import { forwardRef } from "react";

const BudgetInput = forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    suffix: string;
  }
>(function BudgetInput({ value, onChange, placeholder, suffix }, fwdRef) {
  const [focused, setFocused] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw);
  }

  const displayValue = value ? `$${Number(value).toLocaleString()}` : "";

  return (
    <div
      className={cn(
        "relative flex items-center justify-between h-9 flex-1 rounded-xl border px-3 py-3 transition-colors",
        focused
          ? "border-black dark:border-white"
          : "border-black/15 dark:border-white/15",
      )}
    >
      <input
        className={cn(
          "bg-transparent outline-none w-full text-sm font-normal leading-[1.2] tracking-[-0.09px]",
          value
            ? "text-black dark:text-white"
            : "text-black/40 dark:text-white/40 placeholder:text-black/40 dark:placeholder:text-white/40",
        )}
        inputMode="numeric"
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        ref={fwdRef}
        type="text"
        value={displayValue}
      />
      <span className="text-xs font-normal leading-[1.2] text-black/40 dark:text-white/56 shrink-0 ml-1">
        {suffix}
      </span>
    </div>
  );
});

export { GlassFilterPill, GlassBudgetPill, GlassSortPill, type BudgetRange };

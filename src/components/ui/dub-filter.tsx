"use client";

import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { Check } from "lucide-react";
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type SVGProps,
  type ComponentType,
} from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size as sizeMiddleware,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";

// ── Types ────────────────────────────────────────────────────────────

type FilterIcon = ReactNode | ComponentType<SVGProps<SVGSVGElement>>;

export type FilterOption = {
  value: string;
  label: string;
  right?: ReactNode;
  icon?: FilterIcon;
  hideDuringSearch?: boolean;
};

export type Filter = {
  key: string;
  icon: FilterIcon;
  label: string;
  options: FilterOption[] | null;
  multiple?: boolean;
  singleSelect?: boolean;
  separatorAfter?: boolean;
};

export type ActiveFilter = {
  key: string;
  values: string[];
};

// ── Helpers ──────────────────────────────────────────────────────────

function isReactNode(element: unknown): element is ReactNode {
  return (
    element !== null &&
    element !== undefined &&
    (typeof element === "string" ||
      typeof element === "number" ||
      (typeof element === "object" && "$$typeof" in (element as object)))
  );
}

function truncate(str: string | null | undefined, maxLength: number): string {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}

// ── Scroll container with fade ──────────────────────────────────────

const FilterScroll = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, forwardedRef) => {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    const [scrollProgress, setScrollProgress] = useState(1);

    const updateScroll = useCallback(() => {
      const el = ref.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      setScrollProgress(maxScroll <= 0 ? 1 : scrollTop / maxScroll);
    }, []);

    return (
      <>
        <div
          className="scrollbar-hide max-h-[50vh] overflow-y-auto sm:w-auto"
          ref={ref}
          onScroll={updateScroll}
        >
          {children}
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full rounded-b-2xl bg-gradient-to-t from-[var(--card-bg,#fff)] sm:block"
          style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
        />
      </>
    );
  },
);
FilterScroll.displayName = "FilterScroll";

// ── Item row ────────────────────────────────────────────────────────

function FilterButton({
  filter,
  option,
  right,
  showCheckbox,
  isChecked,
  onSelect,
}: {
  filter: Filter;
  option?: FilterOption;
  right?: ReactNode;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onSelect: () => void;
}) {
  const Icon = option ? option.icon ?? filter.icon : filter.icon;
  const label = option ? option.label : filter.label;

  return (
    <Command.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-left text-[13px] tracking-[-0.09px]",
        "text-page-text outline-none transition-colors",
        "data-[selected=true]:bg-foreground/[0.06]",
      )}
      onSelect={onSelect}
      value={label + (option?.value ?? "")}
    >
      {showCheckbox && (
        <div
          className={cn(
            "flex size-4 items-center justify-center rounded border transition-colors",
            isChecked
              ? "border-foreground bg-foreground"
              : "border-border",
          )}
        >
          {isChecked && <Check className="size-3 text-card-bg" />}
        </div>
      )}
      {Icon && (
        <span className="shrink-0 text-page-text-muted">
          {isReactNode(Icon)
            ? Icon
            : (() => {
                const IconComp = Icon as ComponentType<SVGProps<SVGSVGElement>>;
                return <IconComp className="size-4" />;
              })()}
        </span>
      )}
      <span className="flex-1 font-inter">{truncate(label, 48)}</span>
      {right && (
        <div className="ml-1 flex shrink-0 justify-end text-page-text-muted">
          {right}
        </div>
      )}
    </Command.Item>
  );
}

// ── Dropdown panel (shared by all variants) ─────────────────────────

function DropdownPanel({
  isOpen,
  filters,
  activeFilters,
  onSelect,
  onRemove,
  onClose,
  searchPlaceholder,
}: {
  isOpen: boolean;
  filters: Filter[];
  activeFilters?: ActiveFilter[];
  onSelect: (key: string, value: string | string[]) => void;
  onRemove: (key: string, value: string) => void;
  onClose: () => void;
  searchPlaceholder?: string;
}) {
  const listContainer = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSearch("");
    setSelectedFilterKey(null);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const selectedFilter = selectedFilterKey
    ? filters.find(({ key }) => key === selectedFilterKey)
    : null;

  const openFilter = useCallback((key: string) => {
    setSearch("");
    setSelectedFilterKey(key);
  }, []);

  const isOptionSelected = useCallback(
    (value: string) => {
      if (!selectedFilter || !activeFilters) return false;
      const active = activeFilters.find((f) => f.key === selectedFilterKey);
      return active?.values.includes(value) ?? false;
    },
    [selectedFilter, activeFilters, selectedFilterKey],
  );

  const selectOption = useCallback(
    (value: string) => {
      if (!selectedFilter) return;
      const isSingle = selectedFilter.singleSelect || !selectedFilter.multiple;

      if (isSingle) {
        const isSelected = isOptionSelected(value);
        isSelected
          ? onRemove(selectedFilter.key, value)
          : onSelect(selectedFilter.key, value);
        onClose();
      } else {
        const isSelected = isOptionSelected(value);
        isSelected
          ? onRemove(selectedFilter.key, value)
          : onSelect(selectedFilter.key, value);
      }
    },
    [selectedFilter, isOptionSelected, onSelect, onRemove, onClose],
  );

  // For single-filter mode (no drill-in), auto-open the filter
  const isSingleFilterMode = filters.length === 1;
  useEffect(() => {
    if (isOpen && isSingleFilterMode && !selectedFilterKey) {
      setSelectedFilterKey(filters[0].key);
    }
  }, [isOpen, isSingleFilterMode, filters, selectedFilterKey]);

  const placeholder = selectedFilter?.label
    ? `${selectedFilter.label}...`
    : searchPlaceholder ?? "Search...";

  return (
    <Command loop shouldFilter={!selectedFilter || true}>
      <div className="flex items-center overflow-hidden rounded-t-2xl border-b border-border">
        <Command.Input
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (selectedFilterKey && !isSingleFilterMode) {
                e.preventDefault();
                e.stopPropagation();
                reset();
              } else {
                onClose();
              }
            }
            if (e.key === "Backspace" && !search && selectedFilterKey && !isSingleFilterMode) {
              reset();
            }
          }}
          className="grow border-0 bg-transparent py-3 pl-4 pr-2 font-inter text-sm text-page-text outline-none placeholder:text-page-text-muted focus:ring-0"
          autoCapitalize="none"
        />
      </div>

      <FilterScroll ref={listContainer}>
        <Command.List
          className={cn(
            "flex w-full flex-col gap-0.5 p-1",
            selectedFilter ? "min-w-[100px]" : "min-w-[180px]",
          )}
        >
          {!selectedFilter
            ? filters.map((filter) => (
                <Fragment key={filter.key}>
                  <FilterButton
                    filter={filter}
                    onSelect={() => openFilter(filter.key)}
                  />
                  {filter.separatorAfter && (
                    <Command.Separator className="-mx-1 my-0.5 border-b border-border" />
                  )}
                </Fragment>
              ))
            : selectedFilter.options?.map((option) => {
                const isSingle =
                  selectedFilter.singleSelect || !selectedFilter.multiple;
                const isSelected = isOptionSelected(option.value);

                return (
                  <FilterButton
                    key={option.value}
                    filter={selectedFilter}
                    option={option}
                    showCheckbox={!isSingle && selectedFilter.multiple}
                    isChecked={isSelected}
                    right={
                      isSingle ? (
                        isSelected ? (
                          <Check className="size-4 text-page-text-muted" />
                        ) : (
                          option.right
                        )
                      ) : (
                        option.right
                      )
                    }
                    onSelect={() => selectOption(option.value)}
                  />
                );
              })}

          <Command.Empty className="p-3 text-center font-inter text-sm text-page-text-muted">
            No matching options
          </Command.Empty>
        </Command.List>
      </FilterScroll>
    </Command>
  );
}

// ── FilterSelect (full trigger + panel) ─────────────────────────────

interface FilterSelectProps {
  filters: Filter[];
  onSelect: (key: string, value: string | string[]) => void;
  onRemove: (key: string, value: string) => void;
  activeFilters?: ActiveFilter[];
  /** Custom trigger — renders children as the clickable trigger */
  children?: ReactNode;
  className?: string;
  /** Floating placement */
  placement?: Placement;
  /** Search input placeholder */
  searchPlaceholder?: string;
}

export function FilterSelect({
  filters,
  onSelect,
  onRemove,
  activeFilters,
  children,
  className,
  placement = "bottom-start",
  searchPlaceholder,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(6),
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

  // Outside click to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const ref = refs.reference.current as HTMLElement | null;
      const floating = refs.floating.current as HTMLElement | null;
      if (ref?.contains(target) || floating?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, refs]);

  return (
    <>
      <div
        ref={refs.setReference}
        className={cn(
          "inline-flex w-fit rounded-xl transition-shadow",
          isOpen && "ring-2 ring-foreground/10",
          className,
        )}
        data-open={isOpen || undefined}
        onClick={() => setIsOpen((v) => !v)}
      >
        {children}
      </div>

      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50"
            >
              <motion.div
                className="overflow-hidden rounded-2xl border border-border bg-card-bg shadow-lg"
                initial={{ opacity: 0, y: -3, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <DropdownPanel
                  isOpen={isOpen}
                  filters={filters}
                  activeFilters={activeFilters}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  onClose={() => setIsOpen(false)}
                  searchPlaceholder={searchPlaceholder}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}

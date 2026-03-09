"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { useSideNav, WORKSPACES } from "./sidebar-context";

function ProgramLogo({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={name}
      className={cn(
        "shrink-0 rounded-full border border-black/10 object-cover",
        className,
      )}
    />
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M12.5 12.5L16 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="8"
        r="5.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function MarketplaceIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M2 6.5V13a1 1 0 001 1h10a1 1 0 001-1V6.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 3.5a1 1 0 011-1h11a1 1 0 011 1v2H1.5v-2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5h3v3.5h-3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkspaceDropdown({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const { workspace: selected, setWorkspace: setSelected } = useSideNav();
  const [show, setShowRaw] = useState(false);
  const setShow = useCallback((v: boolean | ((prev: boolean) => boolean)) => {
    setShowRaw((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "right-start",
    middleware: [offset(8), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  // Close on outside click
  useEffect(() => {
    if (!show) return;
    function handleClick(e: MouseEvent) {
      const floating = document.querySelector("[data-workspace-popover]");
      const reference = refs.domReference.current;
      const target = e.target as Node;
      if (floating?.contains(target)) return;
      if (reference?.contains(target)) return;
      setShow(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [show, refs]);

  // Focus search input when opened
  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
    }
  }, [show]);

  const filteredPrograms = WORKSPACES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={refs.setReference}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-xl text-left text-sm transition-all duration-75",
          "hover:bg-sidebar-hover active:bg-sidebar-active",
          show && "bg-sidebar-active",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <ProgramLogo src={selected.logo} name={selected.name} className="size-7" />
      </button>

      <AnimatePresence>
        {show && (
          <FloatingPortal>
            <div
              ref={setFloatingRef}
              style={floatingStyles}
              className="z-[200]"
              data-workspace-popover
            >
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 256 }}
              >
                <div className="select-none overflow-hidden rounded-xl bg-dropdown-bg shadow-lg ring-1 ring-dropdown-border">
                  {/* Search */}
                  <div className="border-b border-dropdown-border">
                    <label className="flex w-full items-center pl-3.5">
                      <SearchIcon className="size-[18px] shrink-0 text-dropdown-text-muted" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Find program..."
                        className="h-12 w-full border-0 bg-transparent px-2.5 text-sm text-dropdown-text placeholder:text-dropdown-text-muted focus:outline-none"
                      />
                    </label>
                  </div>

                  {/* Programs list */}
                  <div className="max-h-[260px] overflow-y-auto">
                    <div className="p-2">
                      <p className="px-1 pb-1.5 pt-1 text-xs font-medium text-dropdown-text-muted">
                        Programs
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {filteredPrograms.map((program) => {
                          const isSelected = selected.id === program.id;
                          return (
                            <button
                              key={program.id}
                              type="button"
                              onClick={() => {
                                setSelected(program);
                                setShow(false);
                              }}
                              className={cn(
                                "relative flex w-full cursor-pointer items-center gap-x-2.5 rounded-md py-2.5 pl-2 pr-3 text-left transition-all duration-75",
                                "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                                isSelected
                                  ? "bg-sidebar-hover"
                                  : "hover:bg-dropdown-hover active:bg-dropdown-hover",
                              )}
                            >
                              <ProgramLogo
                                src={program.logo}
                                name={program.name}
                                className="size-5"
                              />
                              <span className="block min-w-0 grow truncate text-sm leading-5 text-dropdown-text">
                                {program.name}
                              </span>
                              {isSelected && (
                                <CheckIcon className="size-4 shrink-0 text-dropdown-text-muted" />
                              )}
                            </button>
                          );
                        })}
                        {filteredPrograms.length === 0 && (
                          <p className="p-1 text-sm text-dropdown-text-muted">
                            No programs found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom links */}
                  <div className="border-t border-dropdown-border p-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => setShow(false)}
                        className={cn(
                          "flex cursor-pointer items-center gap-x-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-75",
                          "hover:bg-dropdown-hover active:bg-dropdown-hover",
                          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                        )}
                      >
                        <GridIcon className="size-4 text-dropdown-text-muted" />
                        <span className="text-dropdown-text">All programs</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShow(false)}
                        className={cn(
                          "flex cursor-pointer items-center gap-x-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-75",
                          "hover:bg-dropdown-hover active:bg-dropdown-hover",
                          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                        )}
                      >
                        <MarketplaceIcon className="size-4 text-dropdown-text-muted" />
                        <span className="text-dropdown-text">Marketplace</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

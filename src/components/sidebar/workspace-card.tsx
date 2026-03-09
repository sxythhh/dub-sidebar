"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { useSideNav, WORKSPACES } from "./sidebar-context";

function ProgramLogo({
  src,
  name,
  className,
  variant = "circle",
}: {
  src: string;
  name: string;
  className?: string;
  variant?: "circle" | "rounded";
}) {
  return (
    <img
      src={src}
      alt={name}
      className={cn(
        "shrink-0 border border-foreground/[0.06] object-cover",
        variant === "circle" ? "rounded-full" : "rounded-[6px]",
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

export function WorkspaceCard() {
  const { workspace: selected, setWorkspace: setSelected } = useSideNav();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "bottom-start",
    middleware: [offset(4), shift({ padding: 8 }), flip()],
    whileElementsMounted: autoUpdate,
  });

  // Close on outside click
  useEffect(() => {
    if (!show) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [show]);

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

  const accentColor = selected.accentColor ?? "255, 144, 37";

  return (
    <div ref={containerRef}>
      <button
        ref={refs.setReference}
        type="button"
        onClick={() => setShow((v) => !v)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded-[12px] px-2.5 py-2 text-left transition-all duration-150",
          "hover:brightness-[0.97] dark:hover:brightness-[1.1]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        style={{
          background: `linear-gradient(207.66deg, rgba(255, 255, 255, 0) 75.84%, rgba(${accentColor}, 0.07) 100.02%), var(--color-sidebar-bg)`,
          border: "1px solid var(--color-sidebar-border)",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.03)",
          height: 44,
        }}
      >
        <ProgramLogo
          src={selected.logo}
          name={selected.name}
          className="size-6"
          variant="rounded"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <span className="truncate font-[family-name:var(--font-inter)] text-[14px] font-medium leading-none tracking-[-0.02em] text-sidebar-text">
            {selected.name}
          </span>
          <span className="truncate font-[family-name:var(--font-inter)] text-[10px] font-normal leading-[1.2] tracking-[-0.02em] text-foreground/50">
            {selected.stats ?? "0 campaigns · 0 creators"}
          </span>
        </div>
        <ChevronsUpDown
          className="size-4 shrink-0 text-foreground/50"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {show && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-[200]"
            >
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="origin-top"
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
                                variant="rounded"
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
                        <GridIcon className="size-5 text-dropdown-text-muted sm:size-4" />
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
                        <MarketplaceIcon className="size-5 text-dropdown-text-muted sm:size-4" />
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

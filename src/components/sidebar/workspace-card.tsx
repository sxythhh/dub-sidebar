"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

{/* Google Material Symbols — filled */}
function MaterialAddIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"/>
    </svg>
  );
}

function MaterialSettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
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
  const router = useRouter();
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
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      const floating = refs.floating.current;
      if (floating?.contains(target)) return;
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
                style={{ width: 256, maxWidth: "calc(100vw - 32px)" }}
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
                  <div className="scrollbar-hide max-h-[260px] overflow-y-auto">
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
                        onClick={() => { setShow(false); router.push("/brands/new"); }}
                        className={cn(
                          "flex cursor-pointer items-center gap-x-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-75",
                          "hover:bg-dropdown-hover active:bg-dropdown-hover",
                          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                        )}
                      >
                        <MaterialAddIcon className="size-5 text-dropdown-text-muted sm:size-4" />
                        <span className="text-dropdown-text">Create Brand</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShow(false); router.push("/settings"); }}
                        className={cn(
                          "flex cursor-pointer items-center gap-x-2.5 rounded-md px-2.5 py-2 text-sm transition-all duration-75",
                          "hover:bg-dropdown-hover active:bg-dropdown-hover",
                          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                        )}
                      >
                        <MaterialSettingsIcon className="size-5 text-dropdown-text-muted sm:size-4" />
                        <span className="text-dropdown-text">Settings</span>
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

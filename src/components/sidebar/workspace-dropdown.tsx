"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconPlus,
  IconSettings,
  IconUserPlus,
} from "@tabler/icons-react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Dropdown, useDropdown } from "@/components/ui/dropdown";
import { fontWeights } from "@/lib/font-weight";

const WORKSPACES = [
  { id: "1", name: "Acme Inc", slug: "acme", plan: "pro" as const, logo: "https://ui-avatars.com/api/?name=A&background=7c3aed&color=fff&size=64&bold=true&font-size=0.45" },
  { id: "2", name: "Strato Labs", slug: "strato", plan: "free" as const, logo: "https://ui-avatars.com/api/?name=S&background=0ea5e9&color=fff&size=64&bold=true&font-size=0.45" },
  { id: "3", name: "Nebula Co", slug: "nebula", plan: "free" as const, logo: "https://ui-avatars.com/api/?name=N&background=f97316&color=fff&size=64&bold=true&font-size=0.45" },
];

const planColors: Record<string, string> = {
  enterprise: "text-purple-700",
  advanced: "text-amber-800",
  business: "text-blue-900",
  pro: "text-cyan-900",
  free: "text-neutral-500",
};

function WorkspaceItem({
  ws,
  index,
  isActive,
  onSelect,
}: {
  ws: (typeof WORKSPACES)[number];
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
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

  const isHovered = activeIndex === index;
  const skipAnimation = !hasMounted.current;

  return (
    <div
      ref={internalRef}
      data-proximity-index={index}
      tabIndex={index === (checkedIndex ?? 0) ? 0 : -1}
      role="menuitemradio"
      aria-checked={isActive}
      aria-label={ws.name}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="relative z-10 flex w-full cursor-pointer items-center gap-x-2 rounded-lg px-2 py-2 outline-none"
    >
      <img src={ws.logo} alt="" className="size-5 shrink-0 rounded-full object-cover" />
      <span
        className={cn(
          "block max-w-[140px] truncate text-sm leading-5 transition-colors duration-75",
          isHovered || isActive ? "text-neutral-900" : "text-neutral-600",
        )}
        style={{
          fontVariationSettings: isActive
            ? fontWeights.semibold
            : fontWeights.normal,
        }}
      >
        {ws.name}
      </span>
      <AnimatePresence>
        {isActive && (
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
            className="ml-auto shrink-0 text-neutral-900"
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
                transition: { duration: 0.04, ease: "easeIn" },
              }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WorkspaceDropdown() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(WORKSPACES[0]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 100);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const checkedIndex = WORKSPACES.findIndex((ws) => ws.id === selected.id);

  return (
    <div
      ref={refs.setReference}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <button
        className={cn(
          "flex size-11 items-center justify-center rounded-xl p-1.5 text-left text-sm transition-all duration-75",
          "hover:bg-black/5 active:bg-black/10",
          show && "bg-black/5",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
        )}
      >
        <img src={selected.logo} alt="" className="size-7 shrink-0 rounded-full object-cover" />
      </button>

      <AnimatePresence>
        {show && (
          <FloatingPortal>
            <div
              ref={setFloatingRef}
              style={floatingStyles}
              className="pointer-events-none z-[100]"
            >
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
              >
                <div className="w-72 rounded-xl bg-white shadow-lg ring-1 ring-neutral-200">
                  {/* Header */}
                  <div className="flex items-center gap-x-2.5 px-3 pb-2 pt-3">
                    <img src={selected.logo} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium leading-5 text-neutral-900">
                        {selected.name}
                      </div>
                      <div
                        className={cn(
                          "truncate text-xs capitalize leading-tight",
                          planColors[selected.plan] ?? planColors.free,
                        )}
                      >
                        {selected.plan}
                      </div>
                    </div>
                  </div>

                  {/* Phase 2: expand */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{
                      height: {
                        delay: 0.35,
                        duration: 0.3,
                        type: "spring",
                        bounce: 0.1,
                      },
                      opacity: {
                        delay: 0.4,
                        duration: 0.2,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-row gap-1 px-3 pb-2.5">
                      <button className="flex items-center justify-start gap-x-2 rounded-lg border border-neutral-200 px-2 py-1 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-100/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80">
                        <IconSettings
                          size={16}
                          className="text-neutral-800"
                        />
                        <span className="block truncate text-sm">
                          Settings
                        </span>
                      </button>
                      <button className="flex items-center justify-start gap-x-2 rounded-lg border border-neutral-200 px-2 py-1 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-100/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80">
                        <IconUserPlus
                          size={16}
                          className="text-neutral-800"
                        />
                        <span className="block truncate text-sm">
                          Invite members
                        </span>
                      </button>
                    </div>

                    <div className="p-1.5 pt-0">
                      <p className="px-2 pb-1 pt-0.5 text-xs font-medium text-neutral-500">
                        Workspaces
                      </p>
                      <Dropdown checkedIndex={checkedIndex}>
                        {WORKSPACES.map((ws, i) => (
                          <WorkspaceItem
                            key={ws.id}
                            ws={ws}
                            index={i}
                            isActive={selected.id === ws.id}
                            onSelect={() => {
                              setSelected(ws);
                              setShow(false);
                            }}
                          />
                        ))}
                      </Dropdown>
                      <button className="group flex w-full cursor-pointer items-center gap-x-2 rounded-lg px-2 py-2 text-neutral-700 transition-all duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80">
                        <div className="flex size-5 shrink-0 items-center justify-center">
                          <IconPlus
                            size={16}
                            className="text-neutral-500"
                          />
                        </div>
                        <span className="block truncate text-sm leading-5 text-neutral-600">
                          Create workspace
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

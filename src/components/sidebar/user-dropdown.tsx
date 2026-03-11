"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  IconLogout,
  IconReplaceFilled,
  IconShieldCheckFilled,
  IconGiftFilled,
  IconSun,
  IconMoon,
  IconSettingsFilled,
} from "@tabler/icons-react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Dropdown } from "@/components/ui/dropdown";
import { MenuItem } from "@/components/ui/menu-item";
import { useTheme } from "@/components/theme-provider";

export function UserDropdown() {
  const [show, setShow] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isCreator = pathname === "/creator" || pathname.startsWith("/creator/");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "right-end",
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

  return (
    <div
      ref={refs.setReference}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <button
        className={cn(
          "flex size-11 cursor-pointer items-center justify-center rounded-2xl p-1.5 transition-all duration-75",
          "hover:bg-sidebar-hover active:bg-sidebar-active",
          show && "bg-sidebar-hover",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
          alt=""
          className="size-7 shrink-0 rounded-full object-cover"
        />
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
                <div className="w-64 max-w-[calc(100vw-32px)] select-none rounded-xl bg-dropdown-bg shadow-lg ring-1 ring-dropdown-border">
                  {/* User info header */}
                  <div className="flex items-center gap-x-2.5 px-3 pb-2 pt-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium leading-5 text-dropdown-text">
                        Tom Anderson
                      </div>
                      <div className="truncate text-xs leading-tight text-dropdown-text-muted">
                        tom@acme.com
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
                    <div className="p-1.5 pt-0">
                      <Dropdown>
                        <MenuItem
                          icon={IconSettingsFilled}
                          label="Account settings"
                          index={0}
                          onSelect={() => {
                            setShow(false);
                            router.push("/account/settings");
                          }}
                        />
                        <MenuItem
                          icon={IconShieldCheckFilled}
                          label="Security"
                          index={1}
                          onSelect={() => {
                            setShow(false);
                            router.push("/account/settings/security");
                          }}
                        />
                        <MenuItem
                          icon={IconGiftFilled}
                          label="Referrals"
                          index={2}
                          onSelect={() => {
                            setShow(false);
                            router.push("/account/settings/referrals");
                          }}
                        />
                        <MenuItem
                          icon={IconReplaceFilled}
                          label={isCreator ? "Switch to Brand" : "Switch to Creator"}
                          index={3}
                          onSelect={() => {
                            router.push(isCreator ? "/" : "/creator");
                            setTimeout(() => setShow(false), 50);
                          }}
                        />
                      </Dropdown>

                      <div className="mx-2 my-1 border-t border-dropdown-border" />

                      {/* Theme toggle */}
                      <div className="flex items-center justify-between px-[10px] py-2">
                        <span className="text-sm font-medium font-[family-name:var(--font-inter)] tracking-[-0.02em] text-dropdown-text-muted">
                          Theme
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleDarkMode()}
                          className="relative flex h-7 w-[52px] cursor-pointer items-center rounded-full bg-sidebar-active p-0.5 transition-colors"
                        >
                          <motion.div
                            className="absolute flex size-6 items-center justify-center rounded-full bg-dropdown-bg shadow-sm"
                            animate={{ x: darkMode ? 23 : 0 }}
                            transition={{ type: "spring", duration: 0.25, bounce: 0.15 }}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {darkMode ? (
                                <motion.div
                                  key="moon"
                                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <IconMoon size={14} className="text-dropdown-text-muted" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="sun"
                                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <IconSun size={14} className="text-dropdown-text-muted" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </button>
                      </div>

                      <div className="mx-2 my-1 border-t border-dropdown-border" />

                      <Dropdown>
                        <MenuItem
                          icon={IconLogout}
                          label="Log out"
                          index={0}
                          onSelect={() => setShow(false)}
                        />
                      </Dropdown>
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

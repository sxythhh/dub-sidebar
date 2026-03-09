"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconSettingsFilled,
  IconLogout,
  IconReplaceFilled,
  IconShieldCheckFilled,
  IconGiftFilled,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { SIDEBAR_EXPANDED_WIDTH } from "./sidebar-context";
import {
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Dropdown } from "@/components/ui/dropdown";
import { MenuItem } from "@/components/ui/menu-item";
import { useTheme } from "@/components/theme-provider";

export function UserInfoRow() {
  const [show, setShow] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "top-start",
    middleware: [offset(4), shift({ padding: 8 }), flip()],
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
      className="w-full"
    >
      <button
        type="button"
        className={cn(
          "flex w-full shrink-0 cursor-pointer items-center gap-2 rounded-[10px] px-2 py-2.5 transition-colors",
          show
            ? "bg-sidebar-hover"
            : "hover:bg-sidebar-hover",
        )}
      >
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
          alt=""
          className="size-6 shrink-0 rounded-full border border-sidebar-border object-cover"
        />
        <span className="flex-1 truncate text-left font-[family-name:var(--font-inter)] text-sm font-medium leading-none tracking-[-0.02em] text-sidebar-text">
          Vlad Shapoval
        </span>
        <div className="flex size-6 shrink-0 items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-sidebar-text-muted"
          >
            <circle cx="8" cy="3" r="1.25" fill="currentColor" />
            <circle cx="8" cy="8" r="1.25" fill="currentColor" />
            <circle cx="8" cy="13" r="1.25" fill="currentColor" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {show && (
          <FloatingPortal>
            <div
              ref={setFloatingRef}
              style={floatingStyles}
              className="pointer-events-none z-[200]"
            >
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
              >
                <div
                  className="select-none overflow-hidden rounded-xl bg-dropdown-bg shadow-lg ring-1 ring-dropdown-border"
                  style={{ width: 280 }}
                >
                  {/* User info header */}
                  <div className="flex items-center gap-x-2.5 px-3 pb-2 pt-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium leading-5 text-dropdown-text">
                        Vlad Shapoval
                      </div>
                      <div className="truncate text-xs leading-tight text-dropdown-text-muted">
                        vlad@outpace.studio
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
                          onSelect={() => setShow(false)}
                        />
                        <MenuItem
                          icon={IconShieldCheckFilled}
                          label="Security"
                          index={1}
                          onSelect={() => setShow(false)}
                        />
                        <MenuItem
                          icon={IconGiftFilled}
                          label="Referrals"
                          index={2}
                          onSelect={() => setShow(false)}
                        />
                        <MenuItem
                          icon={IconReplaceFilled}
                          label="Switch to Creator"
                          index={3}
                          onSelect={() => setShow(false)}
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
                            transition={{
                              type: "spring",
                              duration: 0.25,
                              bounce: 0.15,
                            }}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {darkMode ? (
                                <motion.div
                                  key="moon"
                                  initial={{
                                    opacity: 0,
                                    rotate: -90,
                                    scale: 0.5,
                                  }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  exit={{
                                    opacity: 0,
                                    rotate: 90,
                                    scale: 0.5,
                                  }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <IconMoon
                                    size={14}
                                    className="text-dropdown-text-muted"
                                  />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="sun"
                                  initial={{
                                    opacity: 0,
                                    rotate: 90,
                                    scale: 0.5,
                                  }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  exit={{
                                    opacity: 0,
                                    rotate: -90,
                                    scale: 0.5,
                                  }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <IconSun
                                    size={14}
                                    className="text-dropdown-text-muted"
                                  />
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

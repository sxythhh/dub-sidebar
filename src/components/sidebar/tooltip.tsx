"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from "react";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export function NavGroupTooltip({
  name,
  description,
  learnMoreHref,
  disabled,
  children,
}: PropsWithChildren<{
  name: string;
  description?: string;
  learnMoreHref?: string;
  disabled?: boolean;
}>) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "right",
    middleware: [offset(8), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const handleEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setShow(true), 100);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <div
      ref={refs.setReference}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {children}
      <AnimatePresence>
        {show && (
          <FloatingPortal>
            {/* Plain div for floating-ui positioning */}
            <div
              ref={setFloatingRef}
              style={floatingStyles}
              className="pointer-events-none z-[100]"
            >
              {/* motion.div for enter/exit animation */}
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="rounded-lg bg-[#212121] px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                  <span>{name}</span>
                  {description && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, height: 0 }}
                      animate={{ opacity: 1, width: "auto", height: "auto" }}
                      transition={{
                        delay: 0.5,
                        duration: 0.25,
                        type: "spring",
                      }}
                      className="overflow-hidden"
                    >
                      <div className="w-44 py-1 text-xs tracking-tight">
                        <p className="text-neutral-400">{description}</p>
                        {learnMoreHref && (
                          <div className="mt-2.5">
                            <Link
                              href={learnMoreHref}
                              target="_blank"
                              className="pointer-events-auto font-semibold text-white underline"
                            >
                              Learn more
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

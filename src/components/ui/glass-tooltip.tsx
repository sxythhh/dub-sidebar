"use client";

import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassTooltipProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Glass-styled tooltip. Shows on hover above the trigger.
 * If no children are provided, renders an info circle icon.
 */
function GlassTooltip({ text, children, className }: GlassTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
      setShow(true);
    }
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("cursor-help", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children ?? <Info size={12} className="text-glass-text-secondary" />}
      </div>
      {show &&
        pos &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] w-[328px] rounded-lg p-2 pointer-events-none -translate-x-1/2 -translate-y-full"
            // Inline style intentional — @utility bg classes don't apply reliably on portal elements
            style={{
              top: pos.top,
              left: pos.left,
              backgroundColor: "#212121",
              backgroundImage: "linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05))",
            }}
          >
            <p className="text-xs font-normal leading-[120%] text-[oklch(1_0_0)] m-0">
              {text}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}

export { GlassTooltip };

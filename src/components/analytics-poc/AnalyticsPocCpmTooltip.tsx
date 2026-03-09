"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocPlatformIcon,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import type { AnalyticsPocPlatform } from "./types";

export interface AnalyticsPocCpmPlatformRow {
  platform: AnalyticsPocPlatform;
  label: string;
  cpm: string;
  efficient: boolean;
}

export interface AnalyticsPocCpmTooltipData {
  effectiveCpm: string;
  originalCpm: string;
  efficient: boolean;
  platforms: AnalyticsPocCpmPlatformRow[];
}

interface AnalyticsPocCpmTooltipProps {
  data: AnalyticsPocCpmTooltipData;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsPocCpmTooltip({
  data,
  children,
  className,
}: AnalyticsPocCpmTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
      setShow(true);
    }
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("cursor-default", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show &&
        pos &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] w-[280px] -translate-x-1/2 rounded-2xl p-4 shadow-lg"
            style={{
              top: pos.top,
              left: pos.left,
              background: "var(--ap-surface)",
              border: "1px solid var(--ap-surface-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-inter text-[12px] font-normal text-[var(--ap-text-secondary)]">
                Effective CPM
              </span>
              <span className="font-inter text-[14px] font-semibold text-[var(--ap-text)]">
                {data.effectiveCpm}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-inter text-[12px] font-normal text-[var(--ap-text-secondary)]">
                Target CPM
              </span>
              <span className="font-inter text-[14px] font-normal text-[var(--ap-text-secondary)]">
                {data.originalCpm}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-end">
              <span
                className={cn(
                  "inline-flex h-5 items-center rounded-full px-2 font-inter text-[11px] font-medium leading-[1.2]",
                  data.efficient
                    ? "bg-[rgba(21,128,61,0.1)] text-[#15803d]"
                    : "bg-[rgba(220,38,38,0.1)] text-[#b91c1c]",
                )}
              >
                {data.efficient ? "Efficient" : "Inefficient"}
              </span>
            </div>

            <div className="mt-3 border-t border-[var(--ap-border)] pt-3">
              <p className="mb-2 font-inter text-[11px] font-medium uppercase tracking-[0.5px] text-[var(--ap-text-tertiary)]">
                By Platform
              </p>
              <div className="space-y-2">
                {data.platforms.map((row) => (
                  <div
                    key={row.platform}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      {hasAnalyticsPocPlatformIcon(row.platform) ? (
                        <AnalyticsPocPlatformIcon
                          platform={row.platform}
                          size={14}
                          tone="brand"
                        />
                      ) : null}
                      <span className="font-inter text-[13px] font-normal text-[var(--ap-text-strong)]">
                        {row.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-inter text-[13px] font-semibold text-[var(--ap-text)]">
                        {row.cpm}
                      </span>
                      <span
                        className={cn(
                          "inline-block size-1.5 rounded-full",
                          row.efficient ? "bg-[#15803d]" : "bg-[#b91c1c]",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

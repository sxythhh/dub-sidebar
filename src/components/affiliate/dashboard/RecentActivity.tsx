"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { AffiliateReferredUser } from "@/types/affiliate.types";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { UserPlusIcon } from "./icons";
import { glassCard, tinyOrb } from "./styles";

interface RecentActivityProps {
  referredUsers: AffiliateReferredUser[];
}

export function RecentActivity({ referredUsers }: RecentActivityProps) {
  const recentUsers = referredUsers.slice(0, 5);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems, referredUsers]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      className="flex flex-col w-full md:w-[300px] md:shrink-0"
      style={{ ...glassCard, gap: 16, padding: 16 }}
    >
      <div
        className="flex items-center justify-between"
        style={{ paddingRight: 16 }}
      >
        <div className="flex items-center flex-1" style={{ gap: 6 }}>
          <Clock size={16} style={{ color: "var(--af-text-muted)" }} />
          <span
            className="text-sm"
            style={{
              color: "var(--af-text-secondary)",
              letterSpacing: "-0.09px",
              lineHeight: "120%",
            }}
          >
            Recent activity
          </span>
        </div>
      </div>

      <div ref={containerRef} className="relative flex flex-col justify-center" style={{ gap: 4 }} onMouseEnter={handlers.onMouseEnter} onMouseMove={handlers.onMouseMove} onMouseLeave={handlers.onMouseLeave}>
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
              initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
            />
          )}
        </AnimatePresence>
        {recentUsers.length === 0 ? (
          <span
            className="text-sm"
            style={{ color: "var(--af-text-faint)", padding: "16px 0" }}
          >
            No recent activity
          </span>
        ) : (
          recentUsers.map((user, i) => (
            <div
              ref={(el) => registerItem(i, el)}
              className="relative z-10 flex items-center cursor-pointer"
              key={user.id}
              style={{ borderRadius: 12, gap: 8, padding: "6px 0" }}
            >
              <div style={tinyOrb(28, "#4D81EE")}>
                <UserPlusIcon color="#FFF" size={14} />
              </div>
              <div
                className="flex flex-col justify-center flex-1 min-w-0"
                style={{ gap: 2 }}
              >
                <span
                  className="text-sm font-medium truncate"
                  style={{
                    color: "var(--af-text)",
                    letterSpacing: "-0.09px",
                    lineHeight: "120%",
                  }}
                >
                  New Clipper
                </span>
                <span
                  className="text-xs truncate"
                  style={{
                    color: "var(--af-text-muted)",
                    lineHeight: "120%",
                  }}
                >
                  {user.name || user.username || "Unknown"} joined
                </span>
              </div>
              <span
                className="text-[10px] font-medium shrink-0"
                style={{
                  color: "var(--af-text-secondary)",
                  letterSpacing: "0.1px",
                  lineHeight: "120%",
                }}
              >
                {formatDistanceToNow(new Date(user.joinedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

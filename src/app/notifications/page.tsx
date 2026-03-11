"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { RichButton } from "@/components/rich-button";
import { IconBrandSketchFilled } from "@tabler/icons-react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";

// ── Changelog Data ─────────────────────────────────────────────────

interface ChangelogItem {
  name: string;
  tag?: string;
  month: string;
  year: string;
  description: string;
  image: string;
}

const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    name: "Snap",
    tag: "NEW",
    month: "Mar",
    year: "2026",
    description:
      "Teamed up with SnapEdit to develop a cutting-edge editing workflow poised for scalable growth and market leadership.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=370&fit=crop",
  },
  {
    name: "Light",
    month: "Feb",
    year: "2026",
    description:
      "Built a lightweight analytics dashboard with real-time metrics, custom date ranges, and exportable PDF reports.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&h=370&fit=crop",
  },
  {
    name: "Pixel",
    month: "Jan",
    year: "2026",
    description:
      "Redesigned the creator discovery page with advanced filtering, portfolio previews, and audience demographic breakdowns.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=370&fit=crop",
  },
  {
    name: "Focus",
    month: "Dec",
    year: "2025",
    description:
      "Launched campaign automation workflows for content approvals, scheduled payments, and status webhooks.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=370&fit=crop",
  },
  {
    name: "Image",
    month: "Nov",
    year: "2025",
    description:
      "Complete platform redesign with new design system, dark mode, rebuilt navigation, and WCAG 2.1 AA accessibility.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=370&fit=crop",
  },
  {
    name: "Angell",
    month: "Oct",
    year: "2025",
    description:
      "Enhanced security with two-factor authentication, session management dashboard, TLS 1.3, and API rate limiting.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=370&fit=crop",
  },
  {
    name: "Clear",
    month: "Sep",
    year: "2025",
    description:
      "Brand dashboard with dedicated KPIs, campaign budget tracking, and creator performance comparisons.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&h=370&fit=crop",
  },
];

// ── Notification Data ──────────────────────────────────────────────

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "submission" | "payout" | "campaign" | "system";
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New submission received", description: "xKaizen submitted a clip for Harry Styles campaign", time: "2m ago", read: false, type: "submission" },
  { id: 2, title: "Payout processed", description: "$1,240.00 sent to your bank account", time: "1h ago", read: false, type: "payout" },
  { id: 3, title: "Campaign milestone", description: "Call of Duty campaign reached 500K views", time: "3h ago", read: true, type: "campaign" },
  { id: 4, title: "New application", description: "ViralVince applied to your Mumford & Sons campaign", time: "5h ago", read: true, type: "submission" },
  { id: 5, title: "System update", description: "Platform maintenance scheduled for March 15", time: "1d ago", read: true, type: "system" },
  { id: 6, title: "Creator milestone", description: "GamingGrace reached 100K followers", time: "2d ago", read: true, type: "campaign" },
];

// ── Notifications Tab ──────────────────────────────────────────────

function NotificationsTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div ref={containerRef} className="relative flex flex-col" onMouseEnter={handlers.onMouseEnter} onMouseMove={handlers.onMouseMove} onMouseLeave={handlers.onMouseLeave}>
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
          />
        )}
      </AnimatePresence>
      {NOTIFICATIONS.map((notif, i) => {
        const hideBorder = activeIndex !== null && (i === activeIndex || i === activeIndex - 1);
        return (
          <div
            key={notif.id}
            ref={(el) => registerItem(i, el)}
            className={cn(
              `flex cursor-pointer gap-3 border-b ${hideBorder ? 'border-transparent' : 'border-border'} px-5 py-4 transition-colors`,
              !notif.read && "bg-foreground/[0.03]",
            )}
          >
            {/* Unread dot */}
            <div className="flex pt-1.5">
              <div className={cn("size-2 rounded-full", !notif.read ? "bg-blue-500" : "bg-transparent")} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                  {notif.title}
                </span>
                <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                  {notif.time}
                </span>
              </div>
              <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                {notif.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Changelog Tab ──────────────────────────────────────────────────

function ChangelogTab() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingFromClick = useRef(false);
  const scrollRaf = useRef<number | null>(null);

  // Debounced scroll handler — only updates once per frame, with hysteresis
  const handleScroll = useCallback(() => {
    if (isScrollingFromClick.current) return;
    if (scrollRaf.current) return; // already queued

    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null;
      const container = scrollRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      // Use a point 30% down the container as the "focus line"
      const focusY = containerRect.top + containerRect.height * 0.3;
      const current = activeIndexRef.current;

      // Find the item closest to the focus line (by its top edge)
      // Pick the item whose top is nearest to but not far below the focus line
      let newIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < CHANGELOG_ITEMS.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Distance from item top to focus line (negative = above, positive = below)
        const dist = rect.top - focusY;
        // Prefer items at or above the focus line, but allow slightly below
        const absDist = dist <= 0 ? Math.abs(dist) : dist * 3;
        if (absDist < bestDist) {
          bestDist = absDist;
          newIdx = i;
        }
      }

      // Only update if actually changed
      if (newIdx !== current) {
        activeIndexRef.current = newIdx;
        setActiveIndex(newIdx);
      }
    });
  }, []);

  const scrollToItem = useCallback((idx: number) => {
    activeIndexRef.current = idx;
    setActiveIndex(idx);
    isScrollingFromClick.current = true;

    // Wait for the expand/collapse animation to finish (500ms),
    // then scroll to the final position
    setTimeout(() => {
      const el = itemRefs.current[idx];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Re-enable scroll tracking after scrollIntoView settles
      setTimeout(() => {
        isScrollingFromClick.current = false;
      }, 800);
    }, 500);
  }, []);

  const activeItem = CHANGELOG_ITEMS[activeIndex];

  return (
    <div className="flex min-h-0 flex-1 bg-page-bg">
      <div className="flex min-h-0 flex-1 justify-center">
        {/* Left column — scrollable list */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex min-h-0 w-full flex-1 flex-col overflow-y-auto"
        >
          <div className="flex max-w-lg flex-col px-5 pb-[60vh] pt-10 md:px-6">
            {CHANGELOG_ITEMS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.name}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  className="cursor-pointer scroll-mt-6 py-1"
                  onClick={() => scrollToItem(idx)}
                >
                  <motion.span
                    className="block select-none font-inter text-[56px] font-medium leading-[1.15] tracking-[-1.2px]"
                    animate={{
                      color: isActive
                        ? "var(--changelog-active)"
                        : "var(--changelog-inactive)",
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      "--changelog-active": "var(--page-text-subtle, #888)",
                      "--changelog-inactive": "var(--changelog-dim, rgba(37,37,37,0.08))",
                    } as React.CSSProperties}
                  >
                    {item.name}
                  </motion.span>
                  {/* Date + description that reveals on active */}
                  <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="flex flex-col gap-1.5 pb-4 pt-1">
                      <div className="flex items-center gap-2">
                        {item.tag && (
                          <span className="rounded-full bg-[#2060DF] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                            {item.tag}
                          </span>
                        )}
                        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                          {item.month} {item.year}
                        </span>
                      </div>
                      <p className="max-w-[400px] font-inter text-sm leading-5 tracking-[-0.02em] text-page-text-muted">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column — preview, top-aligned */}
        <div className="hidden w-[320px] shrink-0 flex-col p-6 pt-10 lg:w-[447px] lg:p-8 lg:pt-10 md:flex">
          <div className="sticky top-10 flex flex-col gap-4">
            {/* Image */}
            <div className="overflow-hidden rounded">
              <motion.img
                key={activeItem.name}
                src={activeItem.image}
                alt={activeItem.name}
                className="aspect-video w-full rounded object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Description */}
            <motion.p
              key={`desc-${activeItem.name}`}
              className="font-inter text-xs leading-[18px] tracking-[-0.12px] text-page-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {activeItem.description}
            </motion.p>

            {/* View more button */}
            <RichButton size="sm" className="w-fit rounded-full">
              View more
            </RichButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex min-h-full flex-col bg-page-bg">
      {/* Header with tab switcher */}
      <div className="sticky top-0 z-10 flex h-14 items-center bg-page-bg">
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab} variant="underline" className="h-full">
          <TabItem label="Notifications" index={0} icon={<Bell className="size-4" strokeWidth={2} />} />
          <TabItem label="Changelog" index={1} icon={<IconBrandSketchFilled size={16} />} />
        </Tabs>
      </div>

      {/* Tab content */}
      {activeTab === 0 ? (
        <NotificationsTab />
      ) : (
        <ChangelogTab />
      )}
    </div>
  );
}

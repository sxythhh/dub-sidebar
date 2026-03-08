"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ComponentType,
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
  type SVGProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { UserDropdown } from "./user-dropdown";
import { NavGroupTooltip } from "./tooltip";
import { DubWordmark } from "./icons/dub-wordmark";
import { StarsLogo } from "./icons/stars-logo";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { useSideNav } from "./sidebar-context";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

// ── Proximity hover context ──────────────────────────────────────────

interface ProximityContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  activeNavIndices: Set<number>;
  setNavActive: (index: number, active: boolean) => void;
}

const ProximityContext = createContext<ProximityContextValue | null>(null);

// ── Types ──────────────────────────────────────────────────────────────

// Icon component type that accepts data-hovered
export type AnimatedIcon = ComponentType<
  { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>
>;

export type NavItemCommon = {
  name: string;
  href: string;
  exact?: boolean;
  badge?: ReactNode;
  arrow?: boolean;
};

export type NavSubItemType = NavItemCommon;

export type NavItemType = NavItemCommon & {
  icon: AnimatedIcon;
  items?: NavSubItemType[];
};

export type NavGroupType = {
  name: string;
  icon: AnimatedIcon;
  href: string;
  active: boolean;
  description: string;
  learnMoreHref?: string;
  badge?: ReactNode;
};

export type SidebarNavAreas = Record<
  string,
  () => {
    title?: string;
    headerContent?: ReactNode;
    backHref?: string;
    showNews?: boolean;
    hideSwitcherIcons?: boolean;
    direction?: "left" | "right";
    content: {
      name?: string;
      items: NavItemType[];
    }[];
  }
>;

// ── Constants ──────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 304;
const SIDEBAR_GROUPS_WIDTH = 64;
const SIDEBAR_AREAS_WIDTH = SIDEBAR_WIDTH - SIDEBAR_GROUPS_WIDTH;

// ── Main SidebarNav ────────────────────────────────────────────────────

export function SidebarNav({
  groups,
  areas,
  currentArea,
  toolContent,
  newsContent,
  switcher,
  bottom,
}: {
  groups: NavGroupType[];
  areas: SidebarNavAreas;
  currentArea: string | null;
  toolContent?: ReactNode;
  newsContent?: ReactNode;
  switcher?: ReactNode;
  bottom?: ReactNode;
}) {
  const { collapsed, setCollapsed } = useSideNav();
  const hideSwitcherIcons =
    currentArea && areas[currentArea]?.().hideSwitcherIcons;
  const showAreas = currentArea !== null && !collapsed;

  const targetWidth = showAreas ? SIDEBAR_WIDTH : SIDEBAR_GROUPS_WIDTH;

  return (
    <motion.div
      className="h-full"
      animate={{ width: targetWidth }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={
        {
          "--sidebar-groups-width": `${SIDEBAR_GROUPS_WIDTH}px`,
          "--sidebar-areas-width": `${SIDEBAR_AREAS_WIDTH}px`,
        } as CSSProperties
      }
    >
      <nav className="grid size-full grid-cols-[var(--sidebar-groups-width)_1fr]">
        {/* Left icon strip */}
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col items-center p-2">
            {/* Dub wordmark */}
            <div className="pb-1">
              <Link
                href="/"
                className="block overflow-visible rounded-lg px-1 py-2.5 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-black/50"
              >
                <StarsLogo className="h-7" />
              </Link>
            </div>

            {/* Workspace switcher + group icons */}
            {!hideSwitcherIcons && (
              <div className="flex flex-col gap-3">
                {switcher}
                {groups.map((group) => (
                  <NavGroupItem key={group.name} group={group} />
                ))}
              </div>
            )}
          </div>

          {/* Bottom section: collapse + tool content + user */}
          <div className="flex flex-col items-center gap-3 py-3">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className={cn(
                "flex size-11 cursor-pointer items-center justify-center rounded-xl text-neutral-700 transition-colors duration-75",
                "hover:bg-black/5 active:bg-black/10",
                "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
              )}
            >
              {collapsed ? (
                <IconLayoutSidebarLeftExpand size={20} />
              ) : (
                <IconLayoutSidebarLeftCollapse size={20} />
              )}
            </button>
            {toolContent}
            <div className="flex size-12 items-center justify-center">
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Right areas panel */}
        <div
          className={cn(
            "size-full overflow-hidden py-2 pr-2 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            !showAreas && "opacity-0",
          )}
        >
          <SidebarAreasPanel
            areas={areas}
            currentArea={currentArea}
            newsContent={newsContent}
            bottom={bottom}
          />
        </div>
      </nav>
    </motion.div>
  );
}

// ── Areas Panel ────────────────────────────────────────────────────────

function SidebarAreasPanel({
  areas,
  currentArea,
  newsContent,
  bottom,
}: {
  areas: SidebarNavAreas;
  currentArea: string | null;
  newsContent?: ReactNode;
  bottom?: ReactNode;
}) {
  const showNews = currentArea && areas[currentArea]?.().showNews;

  return (
    <div className="flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col overflow-hidden rounded-xl bg-white">
      {/* Nav items */}
      <div className="scrollbar-hide min-h-0 flex-1 rounded-xl">
        <div className="relative flex flex-col p-3 text-neutral-500">
          <div className="relative w-full grow">
            {Object.entries(areas).map(([area, areaConfig]) => {
              const { title, headerContent, backHref, content, direction } = areaConfig();

              const TitleContainer = backHref ? Link : "div";

              return (
                <Area
                  key={area}
                  visible={area === currentArea}
                  direction={direction ?? "right"}
                >
                  {headerContent ? (
                    <div className="mb-2">
                      {headerContent}
                    </div>
                  ) : title && (
                    <TitleContainer
                      href={backHref ?? "#"}
                      className="group mb-2 flex items-center gap-3 px-3 py-2"
                    >
                      {backHref && (
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500",
                            "transition-[transform,background-color,color] duration-150 group-hover:-translate-x-0.5 group-hover:bg-neutral-900/10 group-hover:text-neutral-600",
                          )}
                        >
                          <IconChevronLeft size={12} stroke={2.5} />
                        </div>
                      )}
                      <span className="text-lg font-semibold text-neutral-900">
                        {title}
                      </span>
                    </TitleContainer>
                  )}
                  <div className="flex flex-col gap-8">
                    {content.map(({ name, items }, idx) => (
                      <div key={idx}>
                        {name && (
                          <div className="mb-2 pl-[10px] font-[family-name:var(--font-inter)] text-[11px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.5)]">
                            {name}
                          </div>
                        )}
                        <ProximityNavSection>
                          {items.map((item, itemIdx) => (
                            <NavItem key={item.name} item={item} index={itemIdx} />
                          ))}
                        </ProximityNavSection>
                      </div>
                    ))}
                  </div>
                </Area>
              );
            })}
          </div>
        </div>
      </div>

      {/* News cards — fixed bottom, not clipped */}
      {showNews && newsContent && (
        <div className="shrink-0 rounded-b-xl">{newsContent}</div>
      )}

      {/* Usage — fixed bottom */}
      <AnimatePresence>
        {bottom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="shrink-0 overflow-hidden rounded-b-xl"
          >
            {bottom}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── NavGroupItem (icon strip button) ───────────────────────────────────

function NavGroupItem({ group }: { group: NavGroupType }) {
  const {
    name,
    description,
    learnMoreHref,
    icon: Icon,
    href,
    active,
    badge,
  } = group;
  const [hovered, setHovered] = useState(false);

  return (
    <NavGroupTooltip
      name={name}
      description={description}
      learnMoreHref={learnMoreHref}
    >
      <div>
        <Link
          href={href}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className={cn(
            "relative flex size-11 cursor-pointer items-center justify-center rounded-xl transition-colors duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
            active
              ? "bg-white"
              : "hover:bg-black/5 active:bg-black/10",
          )}
        >
          <Icon className="size-5 text-neutral-700" data-hovered={hovered} />
          {badge && (
            <div className="absolute right-0.5 top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[0.625rem] font-semibold text-white">
              {badge}
            </div>
          )}
        </Link>
      </div>
    </NavGroupTooltip>
  );
}

// ── ProximityNavSection ────────────────────────────────────────────────

function ProximityNavSection({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef);

  const [activeNavIndices, setActiveNavIndices] = useState<Set<number>>(
    () => new Set(),
  );

  const setNavActive = useCallback((index: number, active: boolean) => {
    setActiveNavIndices((prev) => {
      const has = prev.has(index);
      if (active && has) return prev;
      if (!active && !has) return prev;
      const next = new Set(prev);
      if (active) next.add(index);
      else next.delete(index);
      return next;
    });
  }, []);

  useEffect(() => {
    measureItems();
  }, [measureItems, children]);

  // Don't show hover indicator on active nav items
  const showIndicator =
    activeIndex !== null && !activeNavIndices.has(activeIndex);
  const activeRect = showIndicator ? itemRects[activeIndex] : null;

  return (
    <ProximityContext.Provider
      value={{ registerItem, activeIndex, activeNavIndices, setNavActive }}
    >
      <div
        ref={containerRef}
        onMouseMove={handlers.onMouseMove}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        className="relative flex flex-col gap-0.5"
      >
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-xl bg-black/[0.03]"
              initial={{
                opacity: 0,
                top: activeRect.top,
                left: activeRect.left,
                width: activeRect.width,
                height: activeRect.height,
              }}
              animate={{
                opacity: 1,
                top: activeRect.top,
                left: activeRect.left,
                width: activeRect.width,
                height: activeRect.height,
              }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{
                ...springs.moderate,
                opacity: { duration: 0.16 },
              }}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </ProximityContext.Provider>
  );
}

// ── NavItem (area content item) ────────────────────────────────────────

function NavItem({ item, index }: { item: NavItemType | NavSubItemType; index?: number }) {
  const { name, href, exact, arrow } = item;
  const Icon = "icon" in item ? item.icon : undefined;
  const items = "items" in item ? item.items : undefined;
  const [hovered, setHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const proximity = useContext(ProximityContext);

  useEffect(() => {
    if (proximity && index !== undefined) {
      proximity.registerItem(index, itemRef.current);
      return () => proximity.registerItem(index, null);
    }
  }, [proximity, index]);

  const pathname = usePathname();

  const isActive = useMemo(() => {
    const hrefWithoutQuery = href.split("?")[0];
    return exact
      ? pathname === hrefWithoutQuery
      : pathname.startsWith(hrefWithoutQuery);
  }, [pathname, href, exact]);

  // Report active state to proximity context so hover indicator is skipped
  useEffect(() => {
    if (proximity && index !== undefined) {
      proximity.setNavActive(index, isActive && !items);
    }
  }, [proximity, index, isActive, items]);

  return (
    <div ref={itemRef}>
      <Link
        href={href}
        prefetch
        scroll={false}
        data-active={isActive}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className={cn(
          "group flex h-8 cursor-pointer items-center justify-between rounded-xl px-[10px] py-2 text-sm leading-none transition-[color,background-color] duration-75 font-[family-name:var(--font-inter)] font-medium tracking-[-0.02em]",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
          isActive && !items
            ? "bg-[rgba(37,37,37,0.06)] text-[#252525]"
            : "text-[rgba(37,37,37,0.7)]",
        )}
      >
        <span className="flex items-center gap-2.5">
          {Icon && (
            <Icon
              className={cn(
                "size-4",
                !items && "group-data-[active=true]:text-[#252525]",
              )}
              data-hovered={hovered}
            />
          )}
          <span className="flex items-center gap-1.5">
            {name}
            {"badge" in item && item.badge && typeof item.badge === "object" && (
              item.badge
            )}
          </span>
        </span>
        <span className="ml-2 flex items-center gap-2">
          {"badge" in item && item.badge && typeof item.badge !== "object" && (
              <span
                className={cn(
                  "flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold",
                  isActive && !items
                    ? "bg-[rgba(37,37,37,0.1)] text-[#252525]"
                    : "bg-[rgba(37,37,37,0.06)] text-[rgba(37,37,37,0.5)]",
                )}
              >
                {item.badge}
              </span>
          )}
          {items && (
            <IconChevronDown
              size={14}
              className="text-neutral-500 transition-transform duration-75 group-data-[active=true]:rotate-180"
            />
          )}
          {arrow && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-700 transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          )}
        </span>
      </Link>
      {items && (
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
              aria-hidden={!isActive}
            >
              <div className="pl-px pt-1">
                <div className="pl-3.5">
                  <div className="flex flex-col gap-0.5 border-l border-neutral-200 pl-2">
                    {items.map((subItem) => (
                      <NavItem key={subItem.name} item={subItem} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Area (transition wrapper) ──────────────────────────────────────────

function Area({
  visible,
  direction,
  children,
}: PropsWithChildren<{ visible: boolean; direction: "left" | "right" }>) {
  return (
    <div
      className={cn(
        "left-0 top-0 flex size-full flex-col md:transition-[opacity,transform] md:duration-300",
        visible
          ? "relative opacity-100"
          : cn(
              "pointer-events-none absolute opacity-0",
              direction === "left" ? "-translate-x-full" : "translate-x-full",
            ),
      )}
      aria-hidden={!visible ? "true" : undefined}
      {...(!visible ? { inert: true as unknown as boolean } : {})}
    >
      {children}
    </div>
  );
}

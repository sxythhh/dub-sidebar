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
import { IconChevronDown, IconChevronLeft, IconLayoutSidebar, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { UserDropdown } from "./user-dropdown";
import { UserInfoRow } from "./user-info-row";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { NavGroupTooltip } from "./tooltip";

import { StarsLogo } from "./icons/stars-logo";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { useSideNav, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH } from "./sidebar-context";
import { SearchCommand } from "./search-command";
import { FloatingPortal } from "@floating-ui/react";

// ── Sidebar Icon (from dub.co) ──────────────────────────────────────

function LayoutSidebarIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"/>
    </svg>
  );
}

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
  description?: string;
  items?: NavSubItemType[];
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

// ── Main SidebarNav ────────────────────────────────────────────────────

export function SidebarNav({
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
  const { collapsed, setCollapsed } = useSideNav();
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const targetWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  // Collect all nav items from the current area for the collapsed icon strip
  const collapsedItems = useMemo(() => {
    if (!currentArea || !areas[currentArea]) return [];
    const { content } = areas[currentArea]();
    return content.flatMap(({ items }) => items);
  }, [currentArea, areas]);

  return (
    <div
      className="h-full"
      style={
        {
          width: targetWidth,
          "--sidebar-areas-width": `${SIDEBAR_EXPANDED_WIDTH}px`,
        } as CSSProperties
      }
    >
      <nav className="relative size-full select-none">
        {/* Collapsed view — icon strip */}
        <div
          className={cn(
            "group/collapsed absolute inset-0 flex cursor-ew-resize flex-col items-center justify-between border-r border-sidebar-border bg-sidebar-bg transition-opacity duration-100",
            collapsed ? "z-10 opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, [role=menuitemradio]")) return;
            setCollapsed(false);
          }}
        >
          <div className="flex flex-col items-center gap-1 p-2">
            {/* Logo / Expand toggle */}
            <div className="pb-1">
              <NavGroupTooltip name="Show sidebar" disabled={!collapsed}>
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  className="relative flex size-10 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-sidebar-hover focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <StarsLogo className="h-7 text-sidebar-text transition-opacity duration-150 group-hover/collapsed:opacity-0" />
                  <LayoutSidebarIcon className="absolute text-sidebar-text opacity-0 transition-opacity duration-150 group-hover/collapsed:opacity-100" />
                </button>
              </NavGroupTooltip>
            </div>

            {/* Workspace avatar */}
            <WorkspaceDropdown onOpenChange={setWorkspaceOpen} />

            {/* Nav item icons */}
            {collapsedItems.map((item) => {
              const Icon = item.icon;
              const hrefBase = item.href.split("?")[0];
              const isActive = !workspaceOpen && (item.exact
                ? pathname === hrefBase
                : pathname.startsWith(hrefBase));
              return (
                <NavGroupTooltip
                  key={item.name}
                  name={item.name}
                  description={item.description}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors duration-75",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-sidebar-active text-sidebar-text"
                        : "text-sidebar-text-subtle hover:bg-sidebar-hover",
                    )}
                  >
                    <Icon className={cn("size-[18px]", isActive ? "opacity-100" : "opacity-50")} data-hovered={false} />
                    {item.badge && (
                      <div className="absolute right-0.5 top-0.5">
                        {typeof item.badge === "object" ? item.badge : (
                          <span className="flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[0.5rem] font-semibold text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </NavGroupTooltip>
              );
            })}
          </div>

          {/* Bottom: user avatar */}
          <div className="flex flex-col items-center gap-3 py-3">
            <div className="flex size-12 items-center justify-center">
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Expanded view — full areas panel */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden transition-opacity duration-100",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
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
    </div>
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
  const { collapsed, setCollapsed } = useSideNav();
  const showNews = currentArea && areas[currentArea]?.().showNews;

  return (
    <div className="flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar-bg">
        {/* Sidebar header */}
        <div className="flex h-14 shrink-0 items-center justify-between px-2">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-[10px] outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <StarsLogo className="h-6 text-sidebar-text" />
          </Link>
          <HeaderIconGroup collapsed={collapsed} onCollapse={() => setCollapsed(true)} />
        </div>

        {/* Nav items */}
        <div className="min-h-0 flex-1 overflow-clip">
          <div className="relative flex flex-col px-3 pb-3 text-sidebar-text-muted">
            <div className="relative w-full grow">
              {Object.entries(areas).map(([area, areaConfig]) => {
                const { title, headerContent, backHref, content, direction } =
                  areaConfig();

                const TitleContainer = backHref ? Link : "div";

                return (
                  <Area
                    key={area}
                    visible={area === currentArea}
                    direction={direction ?? "right"}
                  >
                    {headerContent ? (
                      <div className="mb-1">{headerContent}</div>
                    ) : (
                      title && (
                        <TitleContainer
                          href={backHref ?? "#"}
                          className="group mb-2 flex items-center gap-3 px-3 py-2"
                        >
                          {backHref && (
                            <div
                              className={cn(
                                "flex size-6 items-center justify-center rounded-lg bg-sidebar-active text-sidebar-text-muted",
                                "transition-[transform,background-color,color] duration-150 group-hover:-translate-x-0.5 group-hover:bg-sidebar-hover group-hover:text-sidebar-text-subtle",
                              )}
                            >
                              <IconChevronLeft size={12} stroke={2.5} />
                            </div>
                          )}
                          <span className="text-lg font-semibold text-sidebar-text">
                            {title}
                          </span>
                        </TitleContainer>
                      )
                    )}

                    <div className="flex flex-col gap-2">
                      {content.map(({ name, items }, idx) => (
                        <div key={idx}>
                          {name && (
                            <div className="mb-2 pl-[10px] font-[family-name:var(--font-inter)] text-[11px] font-normal tracking-[-0.02em] text-sidebar-section-label">
                              {name}
                            </div>
                          )}
                          <ProximityNavSection>
                            {items.map((item, itemIdx) => (
                              <NavItem
                                key={item.name}
                                item={item}
                                index={itemIdx}
                              />
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

        {/* News cards */}
        {showNews && newsContent && (
          <div className="shrink-0 rounded-b-xl">{newsContent}</div>
        )}

        {/* Usage */}
        <AnimatePresence>
          {bottom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="shrink-0 overflow-hidden"
            >
              {bottom}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User info row */}
        <div className="shrink-0 p-3 pt-0">
          <UserInfoRow />
        </div>
    </div>
  );
}

// ── HeaderIconGroup (proximity hover for +, search, sidebar icons) ────

const HEADER_ICON_LABELS = ["New", "Search", "Close sidebar"];

function HeaderIconGroup({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const {
    activeIndex,
    setActiveIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => {
    measureItems();
  }, [measureItems]);

  const register = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
      registerItem(index, el);
    },
    [registerItem],
  );

  // Suppress hover when search dialog is open
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleSearchOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (open) setActiveIndex(null);
  }, [setActiveIndex]);

  const effectiveIndex = dialogOpen ? null : activeIndex;
  const activeRect = effectiveIndex !== null ? itemRects[effectiveIndex] : null;
  const activeLabel =
    effectiveIndex !== null ? HEADER_ICON_LABELS[effectiveIndex] : null;

  // Tooltip positioning: compute from live DOM rect
  const getTooltipPos = useCallback(() => {
    if (activeIndex === null) return null;
    const el = itemRefs.current[activeIndex];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.bottom };
  }, [activeIndex]);

  const tooltipPos = getTooltipPos();

  return (
    <div className="relative pr-0.5">
      <div
        ref={containerRef}
        className="relative flex items-center gap-0.5"
        onMouseMove={dialogOpen ? undefined : handlers.onMouseMove}
        onMouseEnter={dialogOpen ? undefined : handlers.onMouseEnter}
        onMouseLeave={dialogOpen ? undefined : handlers.onMouseLeave}
      >
        {/* Sliding highlight */}
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-sidebar-hover"
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
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{
                ...springs.fast,
                opacity: { duration: 0.12 },
              }}
            />
          )}
        </AnimatePresence>

        {/* New */}
        <div ref={register(0)}>
          <button className="relative z-10 flex size-7 cursor-pointer items-center justify-center rounded-lg text-sidebar-text-muted">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.08333 0.75V6.08333M6.08333 6.08333V11.4167M6.08333 6.08333H0.75M6.08333 6.08333H11.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Search */}
        <div ref={register(1)}>
          <SearchCommand onOpenChange={handleSearchOpenChange} />
        </div>

        {/* Close sidebar */}
        <div ref={register(2)}>
          <button
            type="button"
            onClick={onCollapse}
            className="relative z-10 flex size-7 cursor-pointer items-center justify-center rounded-lg text-sidebar-text-muted"
          >
            <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"/></svg>
          </button>
        </div>
      </div>

      {/* Shared tooltip (portaled to escape overflow) */}
      <FloatingPortal>
        <AnimatePresence>
          {activeLabel && !collapsed && !dialogOpen && tooltipPos && (
            <motion.div
              className="pointer-events-none fixed z-[9999]"
              style={{ top: tooltipPos.y }}
              initial={{ opacity: 0, y: 0, left: tooltipPos.x }}
              animate={{ opacity: 1, y: 4, left: tooltipPos.x }}
              exit={{ opacity: 0, y: 0, transition: { duration: 0.08 } }}
              transition={{
                left: springs.fast,
                opacity: { duration: 0.12 },
                y: { duration: 0.12 },
              }}
            >
              <div
                className="whitespace-nowrap rounded-lg bg-tooltip-bg px-2.5 py-1 text-xs font-medium text-tooltip-text shadow-lg"
                style={{ transform: "translateX(-50%)" }}
              >
                {activeLabel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
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
              className="pointer-events-none absolute rounded-xl bg-sidebar-hover"
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
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && !items
            ? "bg-sidebar-active text-sidebar-text"
            : "text-sidebar-text-subtle",
        )}
      >
        <span className="flex items-center gap-2.5">
          {Icon && (
            <Icon
              className={cn(
                "size-4 opacity-50",
                !items && "group-data-[active=true]:text-sidebar-text group-data-[active=true]:opacity-100",
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
                    ? "bg-sidebar-active text-sidebar-text"
                    : "bg-sidebar-hover text-sidebar-text-muted",
                )}
              >
                {item.badge}
              </span>
          )}
          {items && (
            <IconChevronDown
              size={14}
              className="text-sidebar-text-muted transition-transform duration-75 group-data-[active=true]:rotate-180"
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
              className="text-sidebar-text-subtle transition-transform duration-75 group-hover:-translate-y-px group-hover:translate-x-px"
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
                  <div className="flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
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

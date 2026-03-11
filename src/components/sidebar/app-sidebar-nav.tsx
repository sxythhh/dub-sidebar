"use client";

import {
  IconWorld,
  IconFolder,
  IconTag,
  IconRouteAltRight,
  IconReceipt,
  IconUsers,
  IconPlugConnected,
  IconShieldCheck,
  IconKey,
  IconWebhook,
  IconBell,
  IconApps,
  IconGift,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  SidebarNav,
  type SidebarNavAreas,
  type AnimatedIcon,
  type NavItemType,
} from "./sidebar-nav";
import { SidebarUsage } from "./sidebar-usage";
import { News } from "./news";
import { SidebarCustomizationProvider } from "./sidebar-customization-provider";
import { useSidebarCustomization, applyCustomization } from "@/hooks/use-sidebar-customization";
import { useSideNav } from "./sidebar-context";

// Animated icons
import { Hyperlink } from "./icons/hyperlink";
import { LinesY } from "./icons/lines-y";
import { CursorRays } from "./icons/cursor-rays";
import { User } from "./icons/user";
import { Gear } from "./icons/gear";
import { MoneyBag } from "./icons/money-bag";
import { PieChart } from "./icons/pie-chart";
import { Submissions } from "./icons/submissions";
import { Creators } from "./icons/creators";
import { ChatBubble } from "./icons/chat-bubble";
import { Robot } from "./icons/robot";
import { NotificationBell } from "./icons/notification-bell";
import { Home } from "./icons/home";
import { Brands } from "./icons/brands";
import { Megaphone } from "./icons/megaphone";
import { Paperclip } from "./icons/paperclip";
import { Payouts } from "./icons/payouts";
import { Sparkle } from "./icons/sparkle";
import { Compass } from "./icons/compass";
import { Contracts } from "./icons/contracts";

import { WorkspaceCard } from "./workspace-card";
import { SidebarWalletCard } from "./sidebar-wallet-card";



const FilledBell: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
  <svg viewBox="0 0 12 14" fill="currentColor" {...(props as Record<string, unknown>)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.40402 0 1.26405 2.03564 1.13441 4.62838L1.0148 7.0206C1.0102 7.11274 0.986514 7.20293 0.945254 7.28545L0.127322 8.92131C0.0435915 9.08877 0 9.27343 0 9.46066C0 10.1267 0.53995 10.6667 1.20601 10.6667H2.73335C3.04219 12.1882 4.38736 13.3333 6 13.3333C7.61264 13.3333 8.95781 12.1882 9.26665 10.6667H10.794C11.4601 10.6667 12 10.1267 12 9.46066C12 9.27343 11.9564 9.08877 11.8727 8.92131L11.0547 7.28545C11.0135 7.20293 10.9898 7.11274 10.9852 7.0206L10.8656 4.62839C10.7359 2.03564 8.59598 0 6 0ZM6 12C5.12919 12 4.38836 11.4435 4.1138 10.6667H7.8862C7.61164 11.4435 6.87081 12 6 12Z" />
  </svg>
);

const FilledFinance: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
  <svg viewBox="0 0 14 11" fill="currentColor" {...(props as Record<string, unknown>)}>
    <path d="M2 0C0.895431 0 0 0.895431 0 2V3.33333H13.3333V1.99983C13.3333 0.895158 12.4378 0 11.3333 0H2Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0 8.66667V4.66667H13.3333V8.66667C13.3333 9.77124 12.4379 10.6667 11.3333 10.6667H2C0.89543 10.6667 0 9.77124 0 8.66667ZM3.33333 6C2.96514 6 2.66667 6.29848 2.66667 6.66667C2.66667 7.03486 2.96514 7.33333 3.33333 7.33333H5.33333C5.70152 7.33333 6 7.03486 6 6.66667C6 6.29848 5.70152 6 5.33333 6H3.33333Z" />
  </svg>
);

// Wrap Tabler icons to match AnimatedIcon type
function wrapTabler(TablerIcon: typeof IconWorld): AnimatedIcon {
  const Wrapped: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
    <TablerIcon {...(props as Record<string, unknown>)} />
  );
  Wrapped.displayName = TablerIcon.displayName;
  return Wrapped;
}

const Globe = wrapTabler(IconWorld);
const FolderIcon = wrapTabler(IconFolder);
const TagIcon = wrapTabler(IconTag);
const DiamondTurnRight = wrapTabler(IconRouteAltRight);
const Receipt = wrapTabler(IconReceipt);
const UsersIcon = wrapTabler(IconUsers);
const ShieldCheck = wrapTabler(IconShieldCheck);
const KeyIcon = wrapTabler(IconKey);
const WebhookIcon = wrapTabler(IconWebhook);
const BellIcon = wrapTabler(IconBell);
const AppsIcon = wrapTabler(IconApps);
const GiftIcon = wrapTabler(IconGift);
const IntegrationsIcon = wrapTabler(IconPlugConnected);

const NAV_AREAS: SidebarNavAreas = {
  default: () => ({
    headerContent: (
      <WorkspaceCard />
    ),

    content: [
      {
        name: "Overview",
        items: [
          { name: "Home", icon: Home, href: "/", exact: true, description: "Your dashboard overview and short links." },
          { name: "Campaigns", icon: Megaphone, href: "/campaigns", description: "Create and manage marketing campaigns." },
        ],
      },
      {
        name: "Manage",
        items: [
          { name: "Submissions", icon: Submissions, href: "/submissions", description: "Review and manage creator content submissions." },
          { name: "Creators", icon: Creators, href: "/creators", description: "Browse and manage your creator network." },
          { name: "Contracts", icon: Contracts, href: "/contracts", description: "Manage creator contracts and agreements." },
          { name: "Payouts", icon: Payouts, href: "/payouts", description: "Track earnings and process creator payments." },
          { name: "Analytics", icon: PieChart, href: "/analytics", description: "Performance metrics across all campaigns." },
          { name: "Applications", icon: Paperclip, href: "/applications", description: "Manage incoming creator applications." },
        ],
      },
      {
        name: "Communication",
        items: [
          {
            name: "Messages",
            icon: ChatBubble,
            href: "/messages",
            description: "Direct messages with creators.",
            badge: (
              <span className="flex size-3.5 items-center justify-center rounded-full bg-[rgba(255,37,37,0.1)] text-[10px] font-semibold leading-none tracking-[-0.02em] text-[#FF2525]">
                2
              </span>
            ),
          },
          {
            name: "AI Assistant",
            icon: Robot,
            href: "/ai-assistant",
            description: "Get AI-powered help with your campaigns.",
            shortcut: "⌘E",
          },
          { name: "Notifications", icon: NotificationBell, href: "/notifications", description: "Activity alerts and updates." },
        ],
      },
    ],
  }),

  program: () => ({
    title: "Partner Program",

    content: [
      {
        items: [
          { name: "Overview", icon: LinesY, href: "/program", exact: true },
          { name: "Payouts", icon: Receipt, href: "/program/payouts", badge: 3 },
        ],
      },
      {
        name: "Partners",
        items: [
          { name: "All Partners", icon: UsersIcon, href: "/program/partners" },
          {
            name: "Applications",
            icon: User,
            href: "/program/applications",
            badge: 5,
          },
        ],
      },
      {
        name: "Insights",
        items: [
          { name: "Analytics", icon: LinesY, href: "/program/analytics" },
          { name: "Customers", icon: User, href: "/program/customers" },
        ],
      },
      {
        name: "Engagement",
        items: [
          { name: "Resources", icon: GiftIcon, href: "/program/resources" },
        ],
      },
    ],
  }),

  creator: () => ({
    content: [
      {
        items: [
          { name: "Home", icon: Home, href: "/creator", exact: true, description: "Your creator dashboard." },
          { name: "For you", icon: Sparkle, href: "/creator/for-you", description: "Personalized campaign recommendations." },
          { name: "Discover", icon: Compass, href: "/creator/discover", description: "Browse available campaigns." },
        ],
      },
      {
        name: "Your Work",
        items: [
          { name: "Campaigns", icon: Megaphone, href: "/creator/campaigns", description: "Campaigns you've joined." },
          { name: "Applications", icon: Paperclip, href: "/creator/applications", description: "Your campaign applications." },
          { name: "Submissions", icon: Submissions, href: "/creator/submissions", description: "Your content submissions." },
          { name: "Analytics", icon: PieChart, href: "/creator/analytics", description: "Your performance metrics." },
          { name: "Payouts", icon: Payouts, href: "/creator/payouts", description: "Your earnings and payouts." },
        ],
      },
      {
        name: "Communication",
        items: [
          {
            name: "Messages",
            icon: ChatBubble,
            href: "/creator/messages",
            description: "Direct messages with brands.",
            badge: (
              <span className="flex size-3.5 items-center justify-center rounded-full bg-[rgba(255,37,37,0.1)] text-[10px] font-semibold leading-none tracking-[-0.02em] text-[#FF2525]">
                2
              </span>
            ),
          },
          { name: "Notifications", icon: NotificationBell, href: "/creator/notifications", description: "Activity alerts and updates." },
        ],
      },
    ],
  }),

  workspaceSettings: () => ({
    title: "Settings",
    backHref: "/",
    showNews: true,
    content: [
      {
        name: "Workspace",
        items: [
          { name: "General", icon: Gear, href: "/settings", exact: true },
          { name: "Finance", icon: FilledFinance, href: "/settings/billing" },
          { name: "Members", icon: UsersIcon, href: "/settings/members" },
          {
            name: "Integrations",
            icon: IntegrationsIcon,
            href: "/settings/integrations",
          },
          { name: "My Brands", icon: Brands, href: "/settings/brands" },
        ],
      },
      {
        name: "Account",
        items: [
          {
            name: "Notifications",
            icon: FilledBell,
            href: "/settings/notifications",
          },
        ],
      },
    ],
  }),

};

export function AppSidebarNav() {
  return (
    <SidebarCustomizationProvider>
      <AppSidebarNavInner />
    </SidebarCustomizationProvider>
  );
}

function AppSidebarNavInner() {
  const pathname = usePathname();
  const [newsEmpty, setNewsEmpty] = useState(false);
  const onNewsEmpty = useCallback(() => setNewsEmpty(true), []);
  const { getAreaOverride } = useSidebarCustomization();
  const { editMode } = useSideNav();

  const currentArea = useMemo(() => {
    if (pathname.startsWith("/settings")) return "workspaceSettings";
    if (pathname.startsWith("/program")) return "program";
    if (pathname === "/creator" || pathname.startsWith("/creator/")) return "creator";
    return "default";
  }, [pathname]);

  const walletCard = useMemo(() => <SidebarWalletCard />, []);
  const usageCard = useMemo(() => <SidebarUsage />, []);

  // Apply customization to the default area
  const customizedAreas = useMemo((): SidebarNavAreas => {
    const override = getAreaOverride("default");
    if (!override && !editMode) return NAV_AREAS;

    return {
      ...NAV_AREAS,
      default: () => {
        const base = NAV_AREAS.default();
        if (!override) return base;
        const customized = applyCustomization(
          base.content as { name?: string; items: { name: string; [key: string]: unknown }[] }[],
          override,
        );
        return {
          ...base,
          content: customized as typeof base.content,
        };
      },
    };
  }, [getAreaOverride, editMode]);

  return (
    <SidebarNav
      areas={customizedAreas}
      originalAreas={NAV_AREAS}
      currentArea={currentArea}
      newsContent={!newsEmpty ? <News onEmpty={onNewsEmpty} /> : undefined}
      bottom={
        currentArea === "creator"
          ? walletCard
          : currentArea === "workspaceSettings" && newsEmpty
            ? usageCard
            : undefined
      }
    />
  );
}

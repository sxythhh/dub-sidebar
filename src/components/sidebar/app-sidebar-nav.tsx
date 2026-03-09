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
} from "./sidebar-nav";
import { SidebarUsage } from "./sidebar-usage";
import { News } from "./news";

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
import { Paperclip } from "./icons/paperclip";
import { Payouts } from "./icons/payouts";

import { WorkspaceCard } from "./workspace-card";

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
    direction: "left",
    showNews: true,
    content: [
      {
        items: [
          { name: "Home", icon: Home, href: "/", exact: true, description: "Your dashboard overview and short links." },
          { name: "Submissions", icon: Submissions, href: "/submissions", description: "Review and manage creator content submissions." },
          { name: "Creators", icon: Creators, href: "/creators", description: "Browse and manage your creator network." },
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
          { name: "AI Assistant", icon: Robot, href: "/ai-assistant", description: "Get AI-powered help with your campaigns." },
          { name: "Notifications", icon: NotificationBell, href: "/notifications", description: "Activity alerts and updates." },
        ],
      },
    ],
  }),

  program: () => ({
    title: "Partner Program",
    direction: "left",
    showNews: true,
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

  workspaceSettings: () => ({
    title: "Settings",
    backHref: "/links",
    content: [
      {
        name: "Workspace",
        items: [
          { name: "General", icon: Gear, href: "/settings", exact: true },
          { name: "Billing", icon: Receipt, href: "/settings/billing" },
          { name: "Domains", icon: Globe, href: "/settings/domains" },
          { name: "Members", icon: UsersIcon, href: "/settings/members" },
          {
            name: "Integrations",
            icon: IntegrationsIcon,
            href: "/settings/integrations",
          },
          { name: "Security", icon: ShieldCheck, href: "/settings/security" },
        ],
      },
      {
        name: "Developer",
        items: [
          { name: "API Keys", icon: KeyIcon, href: "/settings/tokens" },
          { name: "Webhooks", icon: WebhookIcon, href: "/settings/webhooks" },
        ],
      },
      {
        name: "Account",
        items: [
          {
            name: "Notifications",
            icon: BellIcon,
            href: "/settings/notifications",
          },
        ],
      },
    ],
  }),

  userSettings: () => ({
    title: "Settings",
    backHref: "/links",
    hideSwitcherIcons: true,
    content: [
      {
        name: "Account",
        items: [
          {
            name: "General",
            icon: Gear,
            href: "/account/settings",
            exact: true,
          },
          {
            name: "Security",
            icon: ShieldCheck,
            href: "/account/settings/security",
          },
          {
            name: "Referrals",
            icon: GiftIcon,
            href: "/account/settings/referrals",
          },
          {
            name: "Notifications",
            icon: BellIcon,
            href: "/settings/notifications",
            arrow: true,
          },
        ],
      },
    ],
  }),
};

export function AppSidebarNav() {
  const pathname = usePathname();
  const [newsEmpty, setNewsEmpty] = useState(false);
  const onNewsEmpty = useCallback(() => setNewsEmpty(true), []);

  const currentArea = useMemo(() => {
    if (pathname.startsWith("/account/settings")) return "userSettings";
    if (pathname.startsWith("/settings")) return "workspaceSettings";
    if (pathname.startsWith("/program")) return "program";
    return "default";
  }, [pathname]);

  return (
    <SidebarNav
      areas={NAV_AREAS}
      currentArea={currentArea}
      newsContent={!newsEmpty ? <News onEmpty={onNewsEmpty} /> : undefined}
      bottom={newsEmpty ? <SidebarUsage /> : undefined}
    />
  );
}

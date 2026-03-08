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
  type NavGroupType,
  type SidebarNavAreas,
  type AnimatedIcon,
} from "./sidebar-nav";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { HelpButton } from "./help-button";
import { ReferButton } from "./refer-button";
import { SidebarUsage } from "./sidebar-usage";
import { News } from "./news";

// Animated icons
import { Compass } from "./icons/compass";
import { ConnectedDots } from "./icons/connected-dots";
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
import { Search } from "./icons/search";
import { NewCampaignButton } from "./new-campaign-dropdown";

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

const NAV_GROUPS: NavGroupType[] = [
  {
    name: "Home",
    description:
      "Create, organize, and measure the performance of your short links.",
    learnMoreHref: "https://dub.co/links",
    icon: Compass,
    href: "/submissions",
    active: true,
  },
  {
    name: "Partner Program",
    description:
      "Kickstart viral product-led growth with powerful referral and affiliate programs.",
    learnMoreHref: "https://dub.co/partners",
    icon: ConnectedDots,
    href: "/program",
    active: false,
  },
];

const NAV_AREAS: SidebarNavAreas = {
  default: () => ({
    headerContent: (
      <div className="flex items-center gap-2">
        <NewCampaignButton />
        <button
          type="button"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Search className="size-3.5" />
        </button>
      </div>
    ),
    direction: "left",
    showNews: true,
    content: [
      {
        items: [
          { name: "Home", icon: Home, href: "/links" },
          { name: "Submissions", icon: Submissions, href: "/submissions" },
          { name: "Creators", icon: Creators, href: "/creators" },
          { name: "Analytics", icon: PieChart, href: "/analytics" },
          { name: "Applications", icon: Paperclip, href: "/applications" },
        ],
      },
      {
        name: "Communication",
        items: [
          {
            name: "Messages",
            icon: ChatBubble,
            href: "/messages",
            badge: (
              <span className="flex size-3.5 items-center justify-center rounded-full bg-[rgba(255,37,37,0.1)] text-[10px] font-semibold leading-none tracking-[-0.02em] text-[#FF2525]">
                2
              </span>
            ),
          },
          { name: "AI Assistant", icon: Robot, href: "/ai-assistant" },
          { name: "Notifications", icon: NotificationBell, href: "/notifications" },
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

  const groups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        active:
          group.href === "/submissions"
            ? !pathname.startsWith("/program") &&
              !pathname.startsWith("/settings") &&
              !pathname.startsWith("/account")
            : pathname.startsWith(group.href),
      })),
    [pathname],
  );

  return (
    <SidebarNav
      groups={groups}
      areas={NAV_AREAS}
      currentArea={currentArea}
      toolContent={
        <HelpButton />
      }
      newsContent={<News onEmpty={onNewsEmpty} />}
      switcher={<WorkspaceDropdown />}
      bottom={newsEmpty ? <SidebarUsage /> : undefined}
    />
  );
}

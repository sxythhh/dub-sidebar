"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home } from "@/components/sidebar/icons/home";
import { Submissions } from "@/components/sidebar/icons/submissions";
import { PieChart } from "@/components/sidebar/icons/pie-chart";
import { ChatBubble } from "@/components/sidebar/icons/chat-bubble";
import { Compass } from "@/components/sidebar/icons/compass";

const NAV_ITEMS = [
  { name: "Home", href: "/links", icon: Home, exact: true },
  { name: "Submissions", href: "/submissions", icon: Submissions },
  { name: "Explore", href: "/creators", icon: Compass },
  { name: "Messages", href: "/messages", icon: ChatBubble },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-0">
        {NAV_ITEMS.map(({ name, href, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);

          return (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-neutral-900"
                  : "text-neutral-400",
              )}
            >
              <Icon
                className={cn(
                  "size-[22px] transition-colors",
                  isActive ? "text-neutral-900" : "text-neutral-400",
                )}
              />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

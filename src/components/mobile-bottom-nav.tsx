"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type SVGProps } from "react";

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="21" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.13306 0.351916C6.45055 -0.117306 5.54945 -0.117305 4.86694 0.351916L0.866942 3.10192C0.324233 3.47503 0 4.09141 0 4.75V10.0486C0 11.1532 0.895431 12.0486 2 12.0486H3.66667C4.03486 12.0486 4.33333 11.7501 4.33333 11.382V9.04863C4.33333 8.12815 5.07953 7.38196 6 7.38196C6.92047 7.38196 7.66667 8.12815 7.66667 9.04863V11.382C7.66667 11.7501 7.96514 12.0486 8.33333 12.0486H10C11.1046 12.0486 12 11.1532 12 10.0486V4.75C12 4.09141 11.6758 3.47503 11.1331 3.10192L7.13306 0.351916Z" fill="currentColor" />
    </svg>
  );
}

function SubmissionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.447715 2.44772 0 3 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H3C2.44772 2 2 1.55228 2 1ZM0 6C0 4.34315 1.34315 3 3 3H17C18.6569 3 20 4.34315 20 6V15C20 16.6569 18.6569 18 17 18H3C1.34315 18 0 16.6569 0 15V6ZM8.56681 7.5987C8.91328 7.43218 9.32452 7.479 9.62469 7.71913L12.1247 9.71913C12.3619 9.9089 12.5 10.1962 12.5 10.5C12.5 10.8038 12.3619 11.0911 12.1247 11.2809L9.62469 13.2809C9.32452 13.521 8.91328 13.5678 8.56681 13.4013C8.22034 13.2348 8 12.8844 8 12.5V8.5C8 8.11559 8.22034 7.76522 8.56681 7.5987Z" fill="currentColor" />
    </svg>
  );
}

function MessagesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.5 0C13.5647 0 16.1899 0.791608 18.0674 2.35691C19.9668 3.94042 21 6.23347 21 9C21 11.7665 19.9668 14.0596 18.0674 15.6431C16.1899 17.2084 13.5647 18 10.5 18C8.88073 18 7.05744 17.8505 5.41575 17.1378C5.13664 17.2938 4.75233 17.4834 4.29596 17.6417C3.34475 17.9717 1.95903 18.2047 0.571921 17.5477C0.299752 17.4187 0.100181 17.174 0.0286359 16.8815C-0.0429088 16.5889 0.0211972 16.2797 0.203145 16.0398C0.891539 15.1318 1.10848 14.4277 1.16855 13.9774C1.22638 13.544 1.14543 13.2957 1.13604 13.2688L1.1367 13.2704C1.1367 13.2704 1.13611 13.2689 1.13523 13.2665L1.13604 13.2688C1.13604 13.2688 1.13499 13.2662 1.1341 13.2641L1.12642 13.2461L1.11364 13.2158C1.03706 13.0322 0.76608 12.3691 0.512595 11.578C0.269341 10.8187 8.46376e-06 9.81649 8.46376e-06 9C8.46376e-06 6.23347 1.03317 3.94042 2.93258 2.35691C4.81015 0.791608 7.43532 0 10.5 0Z" fill="currentColor" />
    </svg>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.9578 0.712652C10.8309 0.289668 10.4416 0 10 0C9.55839 0 9.16907 0.289668 9.04217 0.712652C8.32283 3.11046 7.39036 4.82042 6.10539 6.10539C4.82042 7.39036 3.11046 8.32283 0.712652 9.04217C0.289668 9.16907 0 9.55839 0 10C0 10.4416 0.289668 10.8309 0.712652 10.9578C3.11046 11.6772 4.82042 12.6096 6.10539 13.8946C7.39036 15.1796 8.32283 16.8895 9.04217 19.2873C9.16907 19.7103 9.55839 20 10 20C10.4416 20 10.8309 19.7103 10.9578 19.2873C11.6772 16.8895 12.6096 15.1796 13.8946 13.8946C15.1796 12.6096 16.8895 11.6772 19.2873 10.9578C19.7103 10.8309 20 10.4416 20 10C20 9.55839 19.7103 9.16907 19.2873 9.04217C16.8895 8.32283 15.1796 7.39036 13.8946 6.10539C12.6096 4.82042 11.6772 3.11046 10.9578 0.712652Z" fill="currentColor" />
    </svg>
  );
}

function AnalyticsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.1444 8.21619C13.2679 7.70895 13.3333 7.17899 13.3333 6.63375C13.3333 3.17685 10.7022 0.334483 7.33333 5.10075e-09V6.1623L13.1444 8.21619Z" fill="currentColor" />
      <path d="M12.7001 9.47332L6.44451 7.26231C6.17811 7.16815 6 6.9163 6 6.63375V0C2.63112 0.334483 0 3.17685 0 6.63375C0 10.3156 2.98477 13.3004 6.66667 13.3004C9.333 13.3004 11.6337 11.7351 12.7001 9.47332Z" fill="currentColor" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/submissions", icon: SubmissionsIcon },
  { href: "/creators", icon: StarIcon },
  { href: "/links", icon: HomeIcon, exact: true },
  { href: "/messages", icon: MessagesIcon, badge: 2 },
  { href: "/analytics", icon: AnalyticsIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex h-[83px] items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, icon: Icon, exact, badge }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center justify-center px-4 py-3"
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              {badge && (
                <span className="absolute right-1.5 top-1 flex size-3.5 items-center justify-center rounded-full bg-[#FF2525] font-[family-name:var(--font-inter)] text-[10px] font-semibold leading-none tracking-[-0.02em] text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

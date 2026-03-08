"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { useSideNav } from "./sidebar-context";
import { AppSidebarNav } from "./app-sidebar-nav";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function MainNav({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen, collapsed } = useSideNav();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
      {/* Side nav backdrop — desktop only */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent",
          isOpen
            ? "bg-black/20 backdrop-blur-sm"
            : "bg-transparent max-md:pointer-events-none",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            setIsOpen(false);
          }
        }}
      >
        {/* Side nav */}
        <div
          className={cn(
            "relative h-full w-min max-w-full bg-neutral-200 transition-transform md:translate-x-0",
            !isOpen && "max-md:-translate-x-full",
          )}
        >
          <AppSidebarNav />
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-screen flex-col bg-neutral-200 pb-2 pr-2 pt-2 max-md:bg-[#fbfbfb] max-md:pb-0 max-md:pr-0 max-md:pt-0">
        {/* Mobile header */}
        <MobileHeader />

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl will-change-transform max-md:rounded-none">
          <div className="relative h-full overflow-y-auto bg-[#fbfbfb] pb-16 pt-px md:pb-0">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}

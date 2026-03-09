"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { useSideNav } from "./sidebar-context";
import { AppSidebarNav } from "./app-sidebar-nav";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { OnboardingButton } from "./onboarding-button";

export function MainNav({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen, collapsed } = useSideNav();

  return (
    <div className="flex h-dvh flex-col bg-page-bg md:bg-page-outer-bg">
      <div className="min-h-0 flex-1 md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
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
              "relative h-full w-min max-w-full bg-page-outer-bg transition-transform md:translate-x-0",
              !isOpen && "max-md:-translate-x-full",
            )}
          >
            <AppSidebarNav />
          </div>
        </div>

        {/* Main content — on mobile the outer div is the scroll container so sticky works */}
        <div className="scrollbar-hide relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-page-bg pb-[calc(60px+max(8px,env(safe-area-inset-bottom)))] md:overflow-hidden md:pb-0 md:[contain:layout_style_paint]">
          <MobileHeader />
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col md:overflow-y-auto md:will-change-transform">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Floating onboarding */}
      <OnboardingButton />
    </div>
  );
}

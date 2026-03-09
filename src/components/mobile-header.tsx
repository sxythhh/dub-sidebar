"use client";

import Link from "next/link";
import { IconSearch, IconBell } from "@tabler/icons-react";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-page-border bg-page-bg px-5 md:hidden">
      <Link href="/" className="flex items-center">
        <StarsLogo className="h-7 w-auto" />
      </Link>

      <div className="flex flex-1 items-center justify-end gap-1">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-[#7B7B7B] active:bg-foreground/[0.06]"
        >
          <IconSearch size={20} stroke={2} />
        </button>

        <button
          type="button"
          className="relative flex size-11 items-center justify-center rounded-full text-[#7B7B7B] active:bg-foreground/[0.06]"
        >
          <IconBell size={20} stroke={2} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
        </button>

        <Link href="/account/settings" className="flex size-11 items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
            alt=""
            className="size-8 rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

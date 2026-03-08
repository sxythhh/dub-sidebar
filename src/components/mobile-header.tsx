"use client";

import Link from "next/link";
import { IconSearch, IconBell } from "@tabler/icons-react";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between px-5 md:hidden">
      <Link href="/" className="flex items-center">
        <StarsLogo className="h-7 w-auto" />
      </Link>

      <div className="flex flex-1 items-center justify-end gap-5">
        <button
          type="button"
          className="flex size-6 items-center justify-center text-[rgba(37,37,37,0.5)]"
        >
          <IconSearch size={24} stroke={2} />
        </button>

        <button
          type="button"
          className="relative flex size-6 items-center justify-center text-[#7B7B7B]"
        >
          <IconBell size={24} stroke={2} />
          <span className="absolute -right-0.5 top-0 size-2 rounded-full bg-red-500" />
        </button>

        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
          alt=""
          className="size-8 rounded-full object-cover"
        />
      </div>
    </header>
  );
}

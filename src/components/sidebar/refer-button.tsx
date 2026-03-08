"use client";

import { IconGift } from "@tabler/icons-react";
import Link from "next/link";

export function ReferButton() {
  return (
    <Link
      href="/account/settings/referrals"
      className="flex size-11 shrink-0 items-center justify-center rounded-xl text-neutral-700 transition-colors duration-150 hover:bg-black/5 active:bg-black/10 outline-none focus-visible:ring-2 focus-visible:ring-black/50"
    >
      <IconGift size={20} />
    </Link>
  );
}

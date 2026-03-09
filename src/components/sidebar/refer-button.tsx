"use client";

import { IconGift } from "@tabler/icons-react";
import Link from "next/link";

export function ReferButton() {
  return (
    <Link
      href="/account/settings/referrals"
      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-foreground transition-colors duration-150 hover:bg-accent active:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <IconGift size={20} />
    </Link>
  );
}

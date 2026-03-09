import Link from "next/link";
import { IconHelpCircle } from "@tabler/icons-react";

export function HelpButton() {
  return (
    <Link
      href="/support"
      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-foreground hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <IconHelpCircle size={20} strokeWidth={2} />
    </Link>
  );
}

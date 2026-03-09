"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import NumberFlow from "@number-flow/react";
import { Sparkle } from "./icons/sparkle";
import { Hyperlink } from "./icons/hyperlink";
import { VerifiedAgencyDrawer } from "@/components/verified-agency/VerifiedAgencyDrawer";
import { RichButton } from "@/components/rich-button";

function UsageRow({
  icon: Icon,
  label,
  usage,
  limit,
  warning,
}: {
  icon: typeof Sparkle;
  label: string;
  usage: number;
  limit: number;
  warning: boolean;
}) {
  const percentage = Math.max(
    Math.floor((usage / Math.max(0, usage, limit)) * 100),
    usage === 0 ? 0 : 1,
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-sidebar-text-muted" />
          <span className="text-xs font-medium text-sidebar-text-subtle">{label}</span>
        </div>
        <span className="text-xs font-medium text-sidebar-text-muted">
          <NumberFlow value={usage} /> of <NumberFlow value={limit} />
        </span>
      </div>
      <div className="mt-1.5">
        <div
          className={cn(
            "h-[3px] w-full overflow-hidden rounded-full bg-sidebar-active",
          )}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF8003] to-[#EC3EFF]"
            style={{
              width: `${percentage}%`,
              transition: "width 0.25s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function SidebarUsage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tokensUsage = 1240;
  const tokensLimit = 5000;
  const linksUsage = 12;
  const linksLimit = 25;

  const tokensWarning = tokensUsage / tokensLimit >= 0.9;
  const linksWarning = linksUsage / linksLimit >= 0.9;

  return (
    <div className="px-3 pt-3 pb-1.5">
      <Link
        className="group flex items-center gap-0.5 text-sm font-normal text-sidebar-text-muted transition-colors hover:text-sidebar-text-subtle"
        href="/settings/billing"
      >
        AI usage
        <IconChevronRight
          size={12}
          className="text-sidebar-text-muted transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-sidebar-text-muted"
        />
      </Link>

      <div className="mt-4 flex flex-col gap-4">
        <UsageRow
          icon={Sparkle}
          label="Tokens"
          usage={tokensUsage}
          limit={tokensLimit}
          warning={tokensWarning}
        />
      </div>

      <div className="mt-3">
        <p className="text-xs text-sidebar-text-muted">
          Usage will reset Mar 15, 2026
        </p>
      </div>

      <RichButton
        size="sm"
        onClick={() => setDrawerOpen(true)}
        className="mt-4 w-full rounded-[10px]"
      >
        Unlock more
      </RichButton>

      <VerifiedAgencyDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

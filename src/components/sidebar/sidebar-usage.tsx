"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import NumberFlow from "@number-flow/react";
import { Sparkle } from "./icons/sparkle";
import { Hyperlink } from "./icons/hyperlink";

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
          <Icon className="size-3.5 text-neutral-600" />
          <span className="text-xs font-medium text-neutral-700">{label}</span>
        </div>
        <span className="text-xs font-medium text-neutral-600">
          <NumberFlow value={usage} /> of <NumberFlow value={limit} />
        </span>
      </div>
      <div className="mt-1.5">
        <div
          className={cn(
            "h-[3px] w-full overflow-hidden rounded-full bg-neutral-900/10",
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
  const tokensUsage = 1240;
  const tokensLimit = 5000;
  const linksUsage = 12;
  const linksLimit = 25;

  const tokensWarning = tokensUsage / tokensLimit >= 0.9;
  const linksWarning = linksUsage / linksLimit >= 0.9;

  return (
    <div className="p-3">
      <Link
        className="group flex items-center gap-0.5 text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-700"
        href="/settings/billing"
      >
        AI usage
        <IconChevronRight
          size={12}
          className="text-neutral-400 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-neutral-500"
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
        <p className="text-xs text-neutral-900/40">
          Usage will reset Mar 15, 2026
        </p>
      </div>

      <Link
        href="/upgrade"
        className="mt-4 flex h-8 cursor-pointer items-center justify-center rounded-[10px] bg-neutral-900 px-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Unlock more
      </Link>
    </div>
  );
}

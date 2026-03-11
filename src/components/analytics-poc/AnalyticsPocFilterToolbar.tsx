import { CalendarDays, ChevronDown } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocFilterToolbarProps } from "./types";

function PlatformPill({
  id,
  active,
}: {
  id: string;
  label: string;
  active: boolean;
}) {
  const normalizedId = id.toLowerCase();

  return (
    <button
      type="button"
      className={cn(
        "relative flex size-9 items-center justify-center rounded-full cursor-pointer",
        "bg-foreground/[0.06] backdrop-blur-[12px]",
        "transition-[transform,opacity,background-color] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)] active:scale-[0.95]",
        "hover:bg-foreground/[0.10]",
        active
          ? "text-foreground"
          : "text-foreground/30 dark:text-white/40",
      )}
    >
      <PlatformIcon platform={normalizedId} size={20} />
    </button>
  );
}

export function AnalyticsPocFilterToolbar({
  platforms,
  dateLabel,
  campaignLabel,
  dateSlot,
  campaignSlot,
  className,
}: AnalyticsPocFilterToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <PlatformPill
            active={platform.active}
            id={platform.id}
            key={platform.id}
            label={platform.label}
          />
        ))}
      </div>

      <div className="flex min-w-0 items-center gap-2">
        {dateSlot ?? (
          <button
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "datetime-picker-trigger inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-solid px-2.5 font-inter-display text-xs font-medium leading-4 tracking-[0.12px] text-foreground",
            )}
            type="button"
          >
            <CalendarDays className="size-3.5" />
            {dateLabel}
            <ChevronDown className="size-3.5" />
          </button>
        )}

        {campaignSlot ?? (
          <button
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "analytics-card-bg inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-solid border-primary/12 px-2.5 font-inter-display text-xs font-medium leading-4 tracking-[0.12px] text-foreground",
            )}
            type="button"
          >
            {campaignLabel}
            <ChevronDown className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

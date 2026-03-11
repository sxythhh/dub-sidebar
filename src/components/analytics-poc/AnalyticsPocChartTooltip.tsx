import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

export interface AnalyticsPocChartTooltipRow {
  key: string;
  label: string;
  color: string;
  value: string;
}

interface AnalyticsPocChartTooltipProps {
  label: string;
  rows: AnalyticsPocChartTooltipRow[];
  footerText?: string;
  onFooterClick?: () => void;
  className?: string;
}

export function AnalyticsPocChartTooltip({
  label,
  rows,
  footerText,
  onFooterClick,
  className,
}: AnalyticsPocChartTooltipProps) {
  return (
    <div
      className={cn("w-[200px] rounded-[8px] p-1 font-geist", className)}
      style={{
        backgroundColor: "#151515",
        backgroundImage:
          "linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05))",
      }}
    >
      <div className="flex flex-col p-1">
        <div className="flex items-center justify-between gap-2 pb-[6px]">
          <p className="font-geist text-[12px] font-normal leading-[1.2] text-white/60">
            {label}
          </p>
          {footerText ? (
            onFooterClick ? (
              <button
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "cursor-pointer font-geist text-[11px] font-medium leading-[1.2] text-white transition-opacity hover:opacity-80",
                )}
                onClick={onFooterClick}
                style={{ pointerEvents: "auto" }}
                type="button"
              >
                {footerText}
              </button>
            ) : (
              <p className="font-geist text-[11px] font-medium leading-[1.2] text-white">
                {footerText}
              </p>
            )
          ) : null}
        </div>

        <div className="flex flex-col gap-[6px]">
          {rows.map((row) => (
            <div
              className="flex items-center justify-between gap-[8px]"
              key={row.key}
            >
              <div className="flex min-w-0 items-center gap-[6px]">
                <span
                  className="inline-block size-[8px] shrink-0 rounded-[2px]"
                  style={{ backgroundColor: row.color }}
                />
                <span className="truncate font-geist text-[12px] font-normal leading-[1.2] text-white">
                  {row.label}
                </span>
              </div>
              <span className="ml-auto shrink-0 whitespace-nowrap font-geist text-[12px] font-normal leading-[1.2] text-right text-white tabular-nums">
                {row.value || "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

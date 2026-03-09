import { cn } from "@/lib/utils";

export interface AnalyticsPocPayoutRow {
  id: string;
  creator: string;
  handle: string;
  amount: string;
  date: string;
  status: "paid" | "pending";
}

interface AnalyticsPocPayoutsDetailProps {
  rows: AnalyticsPocPayoutRow[];
  className?: string;
}

const STATUS_CLASS: Record<AnalyticsPocPayoutRow["status"], string> = {
  paid: "bg-emerald-500/15 text-emerald-400",
  pending: "bg-yellow-500/15 text-yellow-400",
};

export function AnalyticsPocPayoutsDetail({
  rows,
  className,
}: AnalyticsPocPayoutsDetailProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-glass-text-primary">
              {row.creator}
            </p>
            <p className="mt-0.5 text-xs text-glass-text-secondary">
              {row.handle} · {row.date}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold text-glass-text-primary">
              {row.amount}
            </span>
            <span
              className={cn(
                "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium capitalize leading-none",
                STATUS_CLASS[row.status],
              )}
            >
              {row.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

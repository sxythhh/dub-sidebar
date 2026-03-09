import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  AnalyticsPocTable,
  type AnalyticsPocTableColumn,
} from "./AnalyticsPocTable";
import type { AnalyticsPocPayoutRow } from "./AnalyticsPocPayoutsDetail";

const STATUS_STYLE: Record<
  AnalyticsPocPayoutRow["status"],
  { bg: string; text: string }
> = {
  paid: {
    bg: "bg-[rgba(21,128,61,0.08)]",
    text: "text-[#15803d]",
  },
  pending: {
    bg: "bg-[rgba(202,138,4,0.08)]",
    text: "text-[#a16207]",
  },
};

const columns: AnalyticsPocTableColumn<AnalyticsPocPayoutRow>[] = [
  {
    header: "Creator",
    id: "creator",
    renderCell: (row) => (
      <div className="flex flex-col gap-0.5">
        <p className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
          {row.creator}
        </p>
        <p className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
          {row.handle}
        </p>
      </div>
    ),
  },
  {
    header: "Date",
    id: "date",
    renderCell: (row) => (
      <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-strong)]">
        {row.date}
      </span>
    ),
    width: "w-[120px]",
  },
  {
    header: "Amount",
    id: "amount",
    renderCell: (row) => (
      <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
        {row.amount}
      </span>
    ),
    width: "w-[120px]",
  },
  {
    header: "Status",
    id: "status",
    renderCell: (row) => {
      const style = STATUS_STYLE[row.status];
      return (
        <span
          className={cn(
            "inline-flex h-5 items-center rounded-full px-2 font-inter text-[11px] font-medium capitalize leading-none",
            style.bg,
            style.text,
          )}
        >
          {row.status}
        </span>
      );
    },
    width: "w-[100px]",
  },
];

interface AnalyticsPocPayoutsTabProps {
  rows: AnalyticsPocPayoutRow[];
  className?: string;
}

export function AnalyticsPocPayoutsTab({
  rows,
  className,
}: AnalyticsPocPayoutsTabProps) {
  const [page, setPage] = useState(1);

  const totalPaid = rows
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + parseFloat(r.amount.replace(/[$,]/g, "")), 0);
  const totalPending = rows
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + parseFloat(r.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-inter text-[20px] font-medium leading-[1.2] tracking-[-0.33px] text-[var(--ap-text)]">
            ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
            paid
          </span>
        </div>
        <span className="font-inter text-[14px] text-[var(--ap-text-quaternary)]">·</span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-inter text-[16px] font-medium leading-[1.2] tracking-[-0.18px] text-[var(--ap-text-strong)]">
            ${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
            pending
          </span>
        </div>
      </div>

      <AnalyticsPocPanel padding="none">
        <AnalyticsPocTable
          columns={columns}
          emptyMessage="No payouts"
          onPageChange={setPage}
          page={page}
          pageSize={10}
          rowKey={(row) => row.id}
          rows={rows}
          sortDirection="desc"
          sortKey="amount"
        />
      </AnalyticsPocPanel>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  totalEntries: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export function LeaderboardPagination({
  page,
  totalPages,
  totalEntries,
  rowsPerPage,
  onPageChange,
}: Props) {
  const rangeStart = (page - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(page * rowsPerPage, totalEntries);

  return (
    <div className="flex items-center" style={{ gap: 16 }}>
      <span
        className="text-sm"
        style={{
          color: "var(--af-text-muted)",
          letterSpacing: "-0.09px",
          lineHeight: "120%",
        }}
      >
        {rangeStart}–{rangeEnd} of {totalEntries}
      </span>
      <div className="flex items-center justify-center" style={{ gap: 8 }}>
        <button
          className="flex items-center justify-center"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "var(--af-bg-dropdown)",
            border: "none",
            borderRadius: 40,
            cursor: page === 1 ? "default" : "pointer",
            height: 24,
            opacity: page === 1 ? 0.4 : 1,
            width: 24,
          }}
          type="button"
        >
          <ChevronLeft size={12} style={{ color: "var(--af-text-faint)" }} />
        </button>
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              className="flex items-center justify-center"
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                backgroundColor: p === page ? "var(--af-hover)" : "transparent",
                border: "none",
                borderRadius: 100,
                cursor: "pointer",
                height: 24,
                width: 24,
              }}
              type="button"
            >
              <span
                className="text-sm"
                style={{
                  color:
                    p === page
                      ? "var(--af-text-secondary)"
                      : "var(--af-text-muted)",
                  letterSpacing: "-0.09px",
                  lineHeight: "120%",
                }}
              >
                {p}
              </span>
            </button>
          ))}
        </div>
        <button
          className="flex items-center justify-center"
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "var(--af-bg-dropdown)",
            border: "none",
            borderRadius: 40,
            cursor: page === totalPages ? "default" : "pointer",
            height: 24,
            opacity: page === totalPages ? 0.4 : 1,
            width: 24,
          }}
          type="button"
        >
          <ChevronRight
            size={12}
            style={{ color: "var(--af-text-secondary)" }}
          />
        </button>
      </div>
    </div>
  );
}

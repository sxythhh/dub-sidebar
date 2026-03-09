import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  FluidTable,
  FluidTableHeader,
  FluidTableBody,
  FluidTableRow,
  FluidTableHead,
  FluidTableCell,
} from "./AnalyticsPocFluidTable";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

type AnalyticsPocTableSortDirection = "asc" | "desc";
export type AnalyticsPocTableAlign = "left" | "center" | "right";

export interface AnalyticsPocTableColumn<T> {
  id: string;
  header: string;
  width?: string;
  align?: AnalyticsPocTableAlign;
  sortable?: boolean;
  getSortValue?: (row: T) => number | string;
  renderCell: (
    row: T,
    context: { absoluteIndex: number; rowIndex: number },
  ) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface AnalyticsPocTableProps<T> {
  columns: AnalyticsPocTableColumn<T>[];
  emptyMessage?: string;
  onPageChange: (nextPage: number) => void;
  onSortKeyChange?: (nextSortKey: string) => void;
  page: number;
  pageSize: number;
  rowKey: (row: T) => string;
  rows: T[];
  sortDirection?: AnalyticsPocTableSortDirection;
  sortKey?: string;
}

function compareSortValues(
  left: number | string,
  right: number | string,
  direction: AnalyticsPocTableSortDirection,
) {
  const leftIsNumber = typeof left === "number";
  const rightIsNumber = typeof right === "number";

  let comparison = 0;

  if (leftIsNumber && rightIsNumber) {
    comparison = left - right;
  } else {
    comparison = String(left).localeCompare(String(right), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  return direction === "asc" ? comparison : -comparison;
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pageItems: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pageItems.push("ellipsis-start");

  for (let page = start; page <= end; page += 1) {
    pageItems.push(page);
  }

  if (end < totalPages - 1) pageItems.push("ellipsis-end");
  pageItems.push(totalPages);

  return pageItems;
}

export function AnalyticsPocTable<T>({
  columns,
  emptyMessage = "No rows available",
  onPageChange,
  onSortKeyChange,
  page,
  pageSize,
  rowKey,
  rows,
  sortDirection = "desc",
  sortKey,
}: AnalyticsPocTableProps<T>) {
  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;

    const activeColumn = columns.find((column) => column.id === sortKey);
    if (!activeColumn?.sortable || !activeColumn.getSortValue) return rows;
    const getSortValue = activeColumn.getSortValue;

    return [...rows].sort((leftRow, rightRow) =>
      compareSortValues(
        getSortValue(leftRow),
        getSortValue(rightRow),
        sortDirection,
      ),
    );
  }, [columns, rows, sortDirection, sortKey]);

  const safePageSize = Math.max(1, pageSize);
  const totalRows = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * safePageSize;
  const endIndexExclusive = Math.min(startIndex + safePageSize, totalRows);
  const pageRows = sortedRows.slice(startIndex, endIndexExclusive);
  const pageItems = getPageItems(currentPage, totalPages);

  const startRange = totalRows === 0 ? 0 : startIndex + 1;
  const endRange = totalRows === 0 ? 0 : endIndexExclusive;

  return (
    <>
      <div className="overflow-x-auto px-4">
        <FluidTable className="min-w-[980px] table-fixed">
          <FluidTableHeader>
            <FluidTableRow>
              {columns.map((column) => {
                const isActiveSort = sortKey === column.id;

                return (
                  <FluidTableHead
                    className={cn(
                      "pr-4 last:pr-0",
                      column.width,
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.headerClassName,
                    )}
                    key={column.id}
                  >
                    {column.sortable ? (
                      <button
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 font-inter text-[12px] font-normal leading-[1.2] tracking-normal text-[var(--ap-text-secondary)] transition-opacity hover:opacity-70",
                          isActiveSort && "opacity-100 text-[var(--ap-text-strong)]",
                        )}
                        onClick={() => onSortKeyChange?.(column.id)}
                        type="button"
                      >
                        <span>{column.header}</span>
                        {isActiveSort ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-60" />
                        )}
                      </button>
                    ) : (
                      <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
                        {column.header}
                      </span>
                    )}
                  </FluidTableHead>
                );
              })}
            </FluidTableRow>
          </FluidTableHeader>

          <FluidTableBody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  className="py-12 text-center font-inter text-sm text-[var(--ap-text-secondary)]"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, rowIndex) => {
                const rowId = rowKey(row);

                return (
                  <FluidTableRow index={rowIndex} key={rowId}>
                    {columns.map((column) => (
                      <FluidTableCell
                        className={cn(
                          "pr-4 last:pr-0",
                          column.width,
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          column.cellClassName,
                        )}
                        key={`${rowId}-${column.id}`}
                      >
                        {column.renderCell(row, {
                          absoluteIndex: startIndex + rowIndex,
                          rowIndex,
                        })}
                      </FluidTableCell>
                    ))}
                  </FluidTableRow>
                );
              })
            )}
          </FluidTableBody>
        </FluidTable>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 px-4 pb-4 pt-2">
        <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-secondary)]">
          Showing {startRange}-{endRange} of {totalRows}
        </span>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "flex size-6 items-center justify-center rounded-full bg-[var(--ap-input-bg)] text-[var(--ap-text-secondary)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition-colors",
              currentPage > 1
                ? "cursor-pointer hover:text-[var(--ap-text-strong)]"
                : "cursor-not-allowed opacity-40",
            )}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            type="button"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          {pageItems.map((item) => {
            if (typeof item !== "number") {
              return (
                <span
                  className="px-1 font-inter text-[14px] leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-tertiary)]"
                  key={item}
                >
                  ...
                </span>
              );
            }

            const isActive = item === currentPage;

            return (
              <button
                className={cn(
                  ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
                  "flex size-6 cursor-pointer items-center justify-center rounded-full font-inter text-[14px] leading-[1.2] tracking-[-0.09px] transition-colors",
                  isActive
                    ? "bg-[var(--ap-hover)] font-normal text-[var(--ap-text-strong)]"
                    : "font-normal text-[var(--ap-text-secondary)] hover:text-[var(--ap-text-strong)]",
                )}
                key={`table-page-${item}`}
                onClick={() => onPageChange(item)}
                type="button"
              >
                {item}
              </button>
            );
          })}

          <button
            aria-label="Next page"
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "flex size-6 items-center justify-center rounded-full bg-[var(--ap-input-bg)] text-[var(--ap-text-secondary)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition-colors",
              currentPage < totalPages
                ? "cursor-pointer hover:text-[var(--ap-text-strong)]"
                : "cursor-not-allowed opacity-40",
            )}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            type="button"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}

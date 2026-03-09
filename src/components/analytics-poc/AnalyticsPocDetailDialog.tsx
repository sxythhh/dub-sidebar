"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AnalyticsPocDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AnalyticsPocDetailDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: AnalyticsPocDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          {subtitle ? (
            <p className="mb-3 text-sm text-glass-text-secondary">
              {subtitle}
            </p>
          ) : null}
          <div className="max-h-[50vh] overflow-y-auto">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

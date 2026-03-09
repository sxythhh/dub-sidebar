"use client";
import { PageShell } from "@/components/page-shell";

export function SettingsShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <PageShell title={title} description={description}>
      <div className="mt-4 max-w-2xl space-y-6 sm:mt-6">{children}</div>
    </PageShell>
  );
}

export function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="px-4 py-4 sm:px-5">{children}</div>
    </div>
  );
}

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
      <div className="mt-6 max-w-2xl space-y-6">{children}</div>
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
    <div className="rounded-lg border border-neutral-200">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

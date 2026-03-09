export function PageShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex h-14 items-center justify-between gap-3 border-b border-page-border px-4 sm:px-5">
        <div className="min-w-0 flex-1">
          <span className="block truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            {title}
          </span>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="px-4 pb-6 pt-5 sm:px-6">{children}</div>}
    </div>
  );
}

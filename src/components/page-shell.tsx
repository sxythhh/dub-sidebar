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
      <div className="flex h-14 items-center justify-between border-b border-page-border px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            {title}
          </span>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="px-6 pb-6 pt-5 max-md:px-5">{children}</div>}
    </div>
  );
}

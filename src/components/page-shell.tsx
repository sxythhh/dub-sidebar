export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-6 max-md:px-5">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

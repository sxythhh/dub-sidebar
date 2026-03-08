"use client";

import { useSideNav } from "@/components/sidebar/sidebar-context";
import { IconMenu2 } from "@tabler/icons-react";

export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { setIsOpen } = useSideNav();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 md:hidden"
        >
          <IconMenu2 size={20} />
        </button>
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

"use client";

import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { useSideNav } from "./sidebar-context";

export function CollapseSidebarButton() {
  const { collapsed, setCollapsed } = useSideNav();

  return (
    <button
      type="button"
      onClick={() => setCollapsed((c) => !c)}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525]"
    >
      {collapsed ? (
        <IconLayoutSidebarLeftExpand size={16} />
      ) : (
        <IconLayoutSidebarLeftCollapse size={16} />
      )}
    </button>
  );
}

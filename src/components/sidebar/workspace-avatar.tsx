"use client";

import { useSideNav } from "./sidebar-context";

export function WorkspaceAvatar() {
  const { workspace } = useSideNav();

  return (
    <div
      className="size-14 overflow-hidden rounded-full"
      style={{
        boxShadow:
          "0px 0px 0px 2px var(--page-bg), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 0.972px 0px rgba(255,255,255,0.36)",
      }}
    >
      <img
        src={workspace.logo}
        alt={workspace.name}
        className="size-full object-cover"
      />
    </div>
  );
}

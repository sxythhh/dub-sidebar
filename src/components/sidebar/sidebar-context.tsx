"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  accentColor: string;
  stats: string;
};

export const WORKSPACES: Workspace[] = [
  {
    id: "1",
    name: "Framer",
    slug: "framer",
    logo: "https://avatar.vercel.sh/framer",
    accentColor: "139, 92, 246",
    stats: "5 campaigns · 23 creators",
  },
  {
    id: "2",
    name: "Cal.com",
    slug: "cal",
    logo: "https://avatar.vercel.sh/cal",
    accentColor: "59, 130, 246",
    stats: "2 campaigns · 12 creators",
  },
  {
    id: "3",
    name: "Outpace Studios",
    slug: "outpace",
    logo: "https://avatar.vercel.sh/outpace",
    accentColor: "255, 144, 37",
    stats: "3 campaigns · 47 creators",
  },
];

type SideNavContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  workspace: Workspace;
  setWorkspace: Dispatch<SetStateAction<Workspace>>;
};

export const SideNavContext = createContext<SideNavContextType>({
  isOpen: false,
  setIsOpen: () => {},
  collapsed: false,
  setCollapsed: () => {},
  workspace: WORKSPACES[2],
  setWorkspace: () => {},
});

export function SideNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>(WORKSPACES[2]);

  // Close side nav when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when side nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <SideNavContext.Provider value={{ isOpen, setIsOpen, collapsed, setCollapsed, workspace, setWorkspace }}>
      {children}
    </SideNavContext.Provider>
  );
}

export function useSideNav() {
  return useContext(SideNavContext);
}

export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const SIDEBAR_EXPANDED_WIDTH = 240;

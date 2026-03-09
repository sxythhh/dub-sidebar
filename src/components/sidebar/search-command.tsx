"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconLink, IconUserPlus } from "@tabler/icons-react";
import { Home } from "./icons/home";
import { Creators } from "./icons/creators";
import { PieChart } from "./icons/pie-chart";
import { Gear } from "./icons/gear";
import { useSideNav } from "./sidebar-context";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
  CommandFooter,
} from "@/components/ui/command";

export function SearchCommand({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const router = useRouter();
  const { searchOpen: open, setSearchOpen } = useSideNav();

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setSearchOpen(next);
      onOpenChange?.(next);
    },
    [setSearchOpen, onOpenChange],
  );

  const navigate = useCallback(
    (href: string) => {
      handleOpenChange(false);
      router.push(href);
    },
    [router, handleOpenChange],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <CommandDialogTrigger className="relative z-10 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sidebar-text-muted">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11.3333 11.3327L8.69998 8.69934M9.99999 5.33268C9.99999 7.91001 7.91065 9.99935 5.33332 9.99935C2.75599 9.99935 0.666656 7.91001 0.666656 5.33268C0.666656 2.75535 2.75599 0.666016 5.33332 0.666016C7.91065 0.666016 9.99999 2.75535 9.99999 5.33268Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round"/></svg>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandPanel>
            <CommandList>
              <CommandGroup>
                <CommandGroupLabel>Pages</CommandGroupLabel>
                <CommandItem value="Home" onClick={() => navigate("/")}>
                  <Home className="size-4" />
                  Home
                  <CommandShortcut>H</CommandShortcut>
                </CommandItem>
                <CommandItem value="Creators" onClick={() => navigate("/creators")}>
                  <Creators className="size-4" />
                  Creators
                  <CommandShortcut>C</CommandShortcut>
                </CommandItem>
                <CommandItem value="Analytics" onClick={() => navigate("/analytics")}>
                  <PieChart className="size-4" />
                  Analytics
                  <CommandShortcut>A</CommandShortcut>
                </CommandItem>
                <CommandItem value="Settings" onClick={() => navigate("/settings")}>
                  <Gear className="size-4" />
                  Settings
                  <CommandShortcut>S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandGroupLabel>Actions</CommandGroupLabel>
                <CommandItem value="Create new campaign">
                  <IconPlus size={16} />
                  Create new campaign
                </CommandItem>
                <CommandItem value="Create short link">
                  <IconLink size={16} />
                  Create short link
                </CommandItem>
                <CommandItem value="Invite team member">
                  <IconUserPlus size={16} />
                  Invite team member
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <span>Navigate with arrow keys</span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">ESC</kbd>
              {" "}to close
            </span>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}

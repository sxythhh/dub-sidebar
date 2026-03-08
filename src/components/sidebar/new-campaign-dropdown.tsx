"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Scratch } from "./icons/scratch";
import { Template } from "./icons/template";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

function NewCampaignDropdown({
  containerRef,
  floatingRef,
  floatingStyles,
  onClose,
  onFromScratch,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  floatingRef: (node: HTMLDivElement | null) => void;
  floatingStyles: React.CSSProperties;
  onClose: () => void;
  onFromScratch: () => void;
}) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef, onClose]);

  return (
    <FloatingPortal>
      <div
        ref={floatingRef}
        style={floatingStyles}
        className="z-[200]"
      >
        <div className="w-[240px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-neutral-200">
          <div className="flex flex-col p-1">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
              onClick={() => {
                onFromScratch();
                onClose();
              }}
            >
              <Scratch className="text-neutral-500" />
              From scratch...
            </button>
            <button
              type="button"
              disabled
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-neutral-400"
            >
              <Template className="text-neutral-300" />
              <span className="flex-1 text-left">Choose a template...</span>
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
                Soon
              </span>
            </button>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}

export function NewCampaignButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    middleware: [offset(6), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <div className="relative flex-1" ref={(node) => { containerRef.current = node; refs.setReference(node); }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-full cursor-pointer items-center justify-between rounded-xl bg-neutral-900 px-3 text-sm font-medium text-white whitespace-nowrap transition-colors hover:bg-neutral-800",
        )}
      >
        <span>New campaign</span>
        <IconChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <NewCampaignDropdown
          containerRef={containerRef}
          floatingRef={setFloatingRef}
          floatingStyles={floatingStyles}
          onClose={() => setOpen(false)}
          onFromScratch={() => {
            // TODO: hook up to campaign creation flow
          }}
        />
      )}
    </div>
  );
}

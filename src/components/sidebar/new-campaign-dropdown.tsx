"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Scratch } from "./icons/scratch";
import { Template } from "./icons/template";
import { RichButton } from "@/components/rich-button";
import { toastManager } from "@/components/ui/toast";
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
  const floatingElRef = useRef<HTMLDivElement | null>(null);
  const combinedFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingElRef.current = node;
      floatingRef(node);
    },
    [floatingRef],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!floatingElRef.current || !floatingElRef.current.contains(target))
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
        ref={combinedFloatingRef}
        style={floatingStyles}
        className="z-[200]"
      >
        <div className="w-[240px] overflow-hidden rounded-xl bg-dropdown-bg shadow-lg ring-1 ring-dropdown-border">
          <div className="flex flex-col p-1">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-dropdown-text-muted transition-colors hover:bg-dropdown-hover"
              onClick={() => {
                onFromScratch();
                onClose();
              }}
            >
              <Scratch className="text-dropdown-text-muted" />
              From scratch...
            </button>
            <button
              type="button"
              disabled
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground"
            >
              <Template className="text-muted-foreground" />
              <span className="flex-1 text-left">Choose a template...</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
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
    <div className="relative" ref={(node) => { containerRef.current = node; refs.setReference(node); }}>
      <RichButton
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="rounded-2xl"
      >
        <span>New campaign</span>
        <IconChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </RichButton>
      {open && (
        <NewCampaignDropdown
          containerRef={containerRef}
          floatingRef={setFloatingRef}
          floatingStyles={floatingStyles}
          onClose={() => setOpen(false)}
          onFromScratch={() => {
            toastManager.add({
              title: "Campaign created",
              description: "Your new campaign is ready to go.",
              type: "success",
            });
          }}
        />
      )}
    </div>
  );
}

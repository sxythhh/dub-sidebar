"use client";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";
import { type ReactNode, type Dispatch, type SetStateAction } from "react";

export function Popover({
  open,
  onOpenChange,
  trigger,
  content,
  side = "right",
  align = "start",
}: {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger: ReactNode;
  content: ReactNode;
  side?: "right" | "bottom" | "top" | "left";
  align?: "start" | "center" | "end";
}) {
  const placement = `${side}-${align}` as Placement;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-[100]"
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

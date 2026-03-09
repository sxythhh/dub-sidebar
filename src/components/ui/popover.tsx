"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import * as React from "react";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

function PopoverTrigger({
  asChild,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild && React.isValidElement(children)) {
    return (
      <PopoverPrimitive.Trigger render={children} {...props} />
    );
  }
  return (
    <PopoverPrimitive.Trigger {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
}
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
    align?: "start" | "center" | "end";
    sideOffset?: number;
    side?: "top" | "bottom" | "left" | "right";
    collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  }
>(({ className, align = "center", sideOffset = 4, side, collisionPadding, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} collisionPadding={collisionPadding}>
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };

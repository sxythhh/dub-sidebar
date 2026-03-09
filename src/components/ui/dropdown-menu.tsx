"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import * as React from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = MenuPrimitive.Root;

function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild && React.isValidElement(children)) {
    return <MenuPrimitive.Trigger render={children} {...props} />;
  }
  return (
    <MenuPrimitive.Trigger {...props}>
      {children}
    </MenuPrimitive.Trigger>
  );
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> & {
    sideOffset?: number;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
  }
>(({ className, sideOffset = 4, align, side, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner sideOffset={sideOffset} align={align} side={side}>
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

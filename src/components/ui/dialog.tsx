"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

function DialogTrigger({
  asChild,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild && React.isValidElement(children)) {
    return <DialogPrimitive.Trigger render={children} {...props} />;
  }
  return (
    <DialogPrimitive.Trigger {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = DialogPrimitive.Portal;

function DialogClose({
  asChild,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & {
  asChild?: boolean;
}) {
  if (asChild && React.isValidElement(children)) {
    return <DialogPrimitive.Close render={children} {...props} />;
  }
  return (
    <DialogPrimitive.Close {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/50 backdrop-blur-md",
      "data-[open]:animate-in data-[ending-style]:animate-out",
      "data-[ending-style]:fade-out-0 data-[open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> & {
    onPointerDownOutside?: (e: Event) => void;
    onEscapeKeyDown?: (e: Event) => void;
    onInteractOutside?: (e: Event) => void;
  }
>(({ className, children, onPointerDownOutside, onEscapeKeyDown, onInteractOutside, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Popup
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "focus:outline-none focus-visible:outline-none",
      )}
      {...props}
    >
      <div className="relative w-full max-w-lg mx-4">
        {/* Card body */}
        <div
          className={cn(
            "glass-dialog-bg",
            "w-full rounded-3xl overflow-hidden shadow-lg",
            "duration-200",
            "data-[open]:animate-in data-[ending-style]:animate-out",
            "data-[ending-style]:fade-out-0 data-[open]:fade-in-0",
            "data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95",
            className,
          )}
        >
          {children}
        </div>
        {/* Close button — outside the card, inline with header */}
        <DialogPrimitive.Close
          style={{ backgroundColor: "color-mix(in oklch, var(--background), var(--foreground) 20%)" }}
          className={cn(
            "absolute left-full ml-2 top-[5px] flex size-8 items-center justify-center rounded-full",
            "transition-opacity hover:opacity-80",
            "focus:outline-none",
          )}
        >
          <X className="size-3.5 text-glass-text-secondary" strokeWidth={2.5} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
    </DialogPrimitive.Popup>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "glass-dialog-header-bg flex items-center justify-center px-6 py-3",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-sm font-medium leading-[120%] tracking-[-0.09px] text-glass-text-secondary",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-glass-text-secondary", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

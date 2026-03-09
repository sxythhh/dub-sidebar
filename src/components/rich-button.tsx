import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type SizeVariant = "sm" | "default" | "lg";

interface RichButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: SizeVariant;
  className?: string;
  asChild?: boolean;
}

const sizeMap: Record<SizeVariant, string> = {
  sm: "h-8 rounded-md gap-1.5 px-3 text-sm",
  default: "h-9 px-4 py-2 text-sm rounded-md",
  lg: "h-10 rounded-md px-6 text-base",
};

const RichButton = React.forwardRef<HTMLButtonElement, RichButtonProps>(
  (
    {
      children,
      size = "default",
      className,
      asChild = false,
      style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const sizeClasses = sizeMap[size];

    return (
      <Comp
        ref={ref}
        className={cn(
          "rich-button cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
          "ring-0",
          "transition-[filter] duration-200 hover:brightness-110 active:brightness-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          sizeClasses,
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

RichButton.displayName = "RichButton";

export { RichButton };

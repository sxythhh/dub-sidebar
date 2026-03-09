"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  checked,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      checked={checked}
      style={
        checked
          ? {
              backgroundColor: "var(--toggle-track)",
              backgroundImage: [
                "radial-gradient(31.76% 50.52% at 64.86% 100.52%, var(--accent-pink) 0%, transparent 100%)",
                "radial-gradient(31.58% 54.43% at 32.86% 102.32%, var(--accent-orange) 0%, transparent 100%)",
                "radial-gradient(42.53% 86.44% at 50.57% 0%, var(--toggle-glow) 0%, var(--toggle-track) 100%)",
              ].join(", "),
            }
          : {
              backgroundColor: "var(--hover)",
              backgroundImage:
                "radial-gradient(42.53% 86.44% at 50.57% 0%, var(--glass-tint) 0%, var(--glass-subtle) 100%)",
              backdropFilter: "blur(6px)",
            }
      }
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glass-border",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[size=default]:h-5 data-[size=default]:w-10",
        "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        style={{ width: 20, height: 16, backgroundColor: "oklch(1 0 0 / 0.88)", boxShadow: "0px 2px 4px oklch(0 0 0 / 0.2)" }}
        className="pointer-events-none block rounded-full ring-0 transition-all duration-150 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

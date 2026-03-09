"use client";

import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DiscoverButtonVariant = "join" | "info";

type DiscoverButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  variant: DiscoverButtonVariant;
  children?: ReactNode;
};

const BORDER_MASK = {
  padding: 1,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask:
    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
};

export function DiscoverButton({
  variant,
  className,
  disabled,
  onClick,
  children,
  ...props
}: DiscoverButtonProps) {
  const isJoin = variant === "join";

  if (isJoin) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center",
          "rounded-[40px] px-8 py-[10px] h-12",
          "hero-join-btn",
          "focus-visible:outline-none cursor-pointer",
          "transition-[transform,filter,box-shadow] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          "active:scale-[0.96] hover:brightness-110",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <span
          className="absolute inset-0 rounded-[40px] pointer-events-none hero-join-btn-border"
          style={BORDER_MASK}
        />
        <span className="relative text-center text-[16px] font-semibold leading-[21px] font-inter-display text-white dark:text-black whitespace-nowrap">
          {children ?? "Join Campaign"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center",
        "size-12 rounded-[40px]",
        "border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)]",
        "hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)]",
        "hover:border-[rgba(0,0,0,0.25)] dark:hover:border-[rgba(255,255,255,0.3)]",
        "focus-visible:outline-none cursor-pointer",
        "transition-[transform,background,border-color] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
        "active:scale-[0.96]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <Image
        src="/icons/svg/circle-info.svg"
        alt=""
        width={20}
        height={20}
        className="relative block opacity-[0.72] invert dark:invert-0"
      />
    </button>
  );
}

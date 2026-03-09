"use client";

import { cn } from "@/lib/utils";

interface BannerSlideIndicatorProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function BannerSlideIndicator({
  count,
  activeIndex,
  onSelect,
  className,
}: BannerSlideIndicatorProps) {
  if (count <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-[5px] rounded-[40px] py-[10px] px-[17px]",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        const isAdjacent = Math.abs(index - activeIndex) === 1;
        const dotWidth = isActive
          ? "w-[20px]"
          : isAdjacent
            ? "w-[8px]"
            : "w-[6px]";

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "h-[4px] rounded-[100px] bg-black",
              "transition-[width,opacity] duration-200 ease-out cursor-pointer",
              "focus-visible:outline-none",
              dotWidth,
              isActive ? "opacity-100" : "opacity-40",
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? "true" : "false"}
          />
        );
      })}
    </div>
  );
}

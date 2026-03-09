"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { BannerSlideIndicator } from "./BannerSlideIndicator";

import type { AgencyCampaign, CampaignStats } from "./types";

interface AgencyImageCardProps {
  campaigns: AgencyCampaign[];
}

export function AgencyImageCard({ campaigns }: AgencyImageCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % campaigns.length);
  }, [campaigns.length]);

  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(advance, 4000);
    return () => clearInterval(interval);
  }, [advance, campaigns.length]);

  const activeCampaign = campaigns[activeIndex];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#EBF0EF] bg-white lg:w-[480px] lg:shrink-0">
      {/* Image carousel — click to advance */}
      <button
        type="button"
        onClick={advance}
        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#f0f0f0]"
      >
        {campaigns.map((campaign, i) => (
          <div
            key={campaign.id}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <Image
              src={campaign.thumbnail}
              alt={campaign.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Bottom overlay with title + indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 p-4 md:p-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <span className="relative z-10 font-sans text-[20px] font-bold leading-[28px] tracking-[-1.15px] text-white md:text-[23px]">
            {activeCampaign?.title}
          </span>

          {campaigns.length > 1 && (
            <div
              className="relative z-10 [&_button]:!bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <BannerSlideIndicator
                count={campaigns.length}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                className="p-0"
              />
            </div>
          )}
        </div>
      </button>

      {/* Stats row — counting animation on slide change */}
      <div className="flex h-[80px] md:h-[91px]">
        {activeCampaign?.stats.map((stat, i) => (
          <CountingStatCell key={`${activeIndex}-${i}`} stat={stat} />
        ))}
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 600) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function CountingStatCell({ stat }: { stat: CampaignStats }) {
  const count = useCountUp(stat.value);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[3.5px] py-4">
      <span className="text-[11px] font-medium leading-[14px] tracking-[-0.24px] text-black md:text-[12px]">
        {stat.label}
      </span>
      <span className="tabular-nums text-[13px] font-medium leading-[17px] tracking-[-0.28px] text-black md:text-[14px]">
        {stat.prefix}
        {formatNumber(count)}
        {stat.suffix}
      </span>
      <span className="text-[11px] font-medium leading-[14px] tracking-[-0.24px] text-black/50 md:text-[12px]">
        {stat.sub}
      </span>
    </div>
  );
}

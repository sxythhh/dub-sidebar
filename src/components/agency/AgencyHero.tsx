"use client";

import Image from "next/image";

import { AgencyImageCard } from "./AgencyImageCard";
import { AgencyBookingWidget } from "./AgencyBookingWidget";
import { AgencyDetails } from "./AgencyDetails";
import { StarRating } from "./StarRating";

import type { AgencyData } from "./types";

export function AgencyHero({ agency }: { agency: AgencyData }) {
  return (
    <section className="flex flex-col gap-8 py-[7px] lg:flex-row lg:items-start lg:justify-between lg:gap-12">
      {/* Left — Image card + details */}
      <div className="flex w-full flex-col gap-6 lg:w-[480px] lg:shrink-0">
        <AgencyImageCard campaigns={agency.campaigns} />
        <AgencyDetails agency={agency} />
      </div>

      {/* Right — Identity + form */}
      <div className="flex w-full flex-col gap-7 lg:w-[457px]">
        {/* Agency identity */}
        <div className="flex items-center gap-4">
          <div className="relative size-[50px] overflow-hidden rounded-xl bg-black shadow-[0_0_0_2.86px_rgba(112,111,111,0.22)] md:size-[60px]">
            <Image
              src={agency.logo}
              alt={agency.name}
              fill
              className="rounded-[11px] object-cover"
              sizes="60px"
            />
          </div>
          <h1 className="font-sans text-[32px] font-semibold leading-[1.2] tracking-[-1.84px] text-black md:text-[46px]">
            {agency.name}
          </h1>
          {agency.verified && (
            <div className="group relative shrink-0 self-center">
              <Image
                src="/icons/verified-light.png"
                alt="Verified Agency"
                width={22}
                height={22}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a0a0a] px-2 py-1 text-[11px] font-medium leading-[14px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                Verified Agency
              </div>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-1.5">
          <StarRating count={agency.rating} />
          <span className="text-[15px] font-medium leading-[27px] tracking-[-0.3px] text-[#545454]">
            Review by {agency.reviewCount} users worldwide
          </span>
        </div>

        {/* Booking widget */}
        <AgencyBookingWidget />
      </div>
    </section>
  );
}

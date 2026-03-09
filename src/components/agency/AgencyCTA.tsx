"use client";

import Image from "next/image";
import type { AgencyData } from "./types";

export function AgencyCTA({ agency }: { agency: AgencyData }) {
  return (
    <section className="relative flex items-center overflow-hidden rounded-2xl bg-[rgba(234,232,230,0.6)] p-4 md:p-5">
      <div className="relative flex w-full flex-col gap-6 rounded-lg p-3 md:flex-row md:items-center md:gap-[50px] md:p-4">
        {/* Left — text content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="mb-2.5 font-sans text-[26px] font-bold leading-[1.2] tracking-[-1.08px] text-[#060612] md:text-[36px]">
            Ready to launch your campaign?
          </h2>
          <p className="text-[16px] font-medium leading-[22px] tracking-[-0.54px] text-[#060612] md:text-[18px]">
            Get started and reach thousands of creators today.
          </p>
        </div>

        {/* Right — booking card */}
        <div className="w-full md:w-[360px] md:shrink-0">
          <div className="agency-cta-card flex flex-col gap-5 rounded-2xl p-5">
            {/* Avatars */}
            <div className="flex items-center gap-2">
              <div className="relative size-[50px] overflow-hidden rounded-full">
                <Image
                  src={agency.logo}
                  alt={agency.name}
                  fill
                  className="object-cover"
                  sizes="50px"
                />
              </div>
              <span className="font-sans text-[20px] font-medium leading-[24px] tracking-[-0.6px] text-[#69686E]">
                +
              </span>
              <div className="flex size-[50px] items-center justify-center rounded-full bg-[#060612]">
                <span className="font-sans text-[16px] font-medium leading-[19px] tracking-[0.04px] text-white">
                  You
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
              <h3 className="font-sans text-[22px] font-medium leading-[26px] tracking-[-0.66px] text-[#060612]">
                Quick 15-minute call
              </h3>
              <p className="font-sans text-[16px] font-medium leading-[19px] tracking-[0.04px] text-[#69686E]">
                Pick a time that works for you.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-[40px] bg-black text-[16px] font-medium leading-[19px] tracking-[0.04px] text-white transition-[transform,background] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:bg-neutral-800 active:scale-[0.96]"
              >
                Contact
              </button>
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-[40px] bg-white transition-[transform,background] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:bg-[#f0f0f0] active:scale-[0.96]"
              >
                <span className="font-sans text-[16px] font-medium leading-[19px] tracking-[0.04px] text-[#060612]">
                  Invite to Workspace
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

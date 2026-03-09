"use client";

import { AgencyHero } from "./AgencyHero";
import { AgencyCTA } from "./AgencyCTA";

import type { AgencyData } from "./types";

export function AgencyLanding({ agency }: { agency: AgencyData }) {
  return (
    <div className="relative min-h-screen bg-white transition-colors">
      <div className="flex flex-col items-center px-5 pb-[70px] pt-12 md:px-[30px] md:pt-[80px]">
        <div className="flex w-full max-w-[1060px] flex-col gap-9">
          <AgencyHero agency={agency} />
          <AgencyCTA agency={agency} />
        </div>
      </div>
    </div>
  );
}

"use client";

import type { AgencyData } from "./types";

function ExternalIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 15 15"
      fill="none"
      className="shrink-0 transition-transform duration-150 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.33334 0.625C8.33334 0.279822 8.61316 0 8.95834 0H14.375C14.7202 0 15 0.279822 15 0.625V6.04167C15 6.38685 14.7202 6.66667 14.375 6.66667C14.0298 6.66667 13.75 6.38685 13.75 6.04167V2.13388L7.10861 8.77528C6.86453 9.01935 6.4688 9.01935 6.22473 8.77528C5.98065 8.5312 5.98065 8.13547 6.22473 7.89139L12.8661 1.25H8.95834C8.61316 1.25 8.33334 0.970178 8.33334 0.625ZM1.93649 1.66667C1.94375 1.66667 1.95103 1.66667 1.95834 1.66667H5.20834C5.55351 1.66667 5.83334 1.94649 5.83334 2.29167C5.83334 2.63684 5.55351 2.91667 5.20834 2.91667H1.95834C1.71467 2.91667 1.5695 2.91715 1.4619 2.92594C1.39622 2.93131 1.36862 2.93839 1.36122 2.94069C1.32402 2.96029 1.29362 2.99069 1.27402 3.02789C1.27173 3.03528 1.26465 3.06289 1.25928 3.12856C1.25049 3.23617 1.25 3.38133 1.25 3.625V13.0417C1.25 13.2853 1.25049 13.4305 1.25928 13.5381C1.26465 13.6038 1.27173 13.6314 1.27402 13.6388C1.29362 13.676 1.32402 13.7064 1.36122 13.726C1.36862 13.7283 1.39622 13.7354 1.4619 13.7407C1.5695 13.7495 1.71467 13.75 1.95834 13.75H11.375C11.6187 13.75 11.7638 13.7495 11.8714 13.7407C11.9371 13.7354 11.9647 13.7283 11.9721 13.726C12.0093 13.7064 12.0397 13.676 12.0593 13.6388C12.0616 13.6314 12.0687 13.6038 12.0741 13.5381C12.0828 13.4305 12.0833 13.2853 12.0833 13.0417V9.16667C12.0833 8.82149 12.3632 8.54167 12.7083 8.54167C13.0535 8.54167 13.3333 8.82149 13.3333 9.16667L13.3333 13.0635C13.3334 13.2781 13.3334 13.4752 13.3199 13.6399C13.3054 13.8175 13.2722 14.0118 13.1744 14.2037C13.0346 14.4781 12.8115 14.7012 12.5371 14.8411C12.3452 14.9388 12.1508 14.9721 11.9732 14.9866C11.8085 15 11.6114 15 11.3969 15H1.93648C1.72191 15 1.52484 15 1.36011 14.9866C1.1825 14.9721 0.988188 14.9388 0.796267 14.8411C0.521863 14.7012 0.298766 14.4781 0.158951 14.2037C0.0611618 14.0118 0.0279426 13.8175 0.0134312 13.6399C-2.84674e-05 13.4752 -1.43612e-05 13.2781 1.0367e-06 13.0635V3.60315C-1.43612e-05 3.38858 -2.84674e-05 3.19151 0.0134312 3.02677C0.0279426 2.84916 0.0611616 2.65485 0.158951 2.46293C0.298766 2.18853 0.521863 1.96543 0.796266 1.82562C0.988188 1.72783 1.1825 1.69461 1.36011 1.6801C1.52485 1.66664 1.72192 1.66665 1.93649 1.66667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ServicePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-6 items-center rounded-full border border-black/10 bg-white px-2 py-[3px] text-black">
      <span className="relative text-[12px] font-semibold leading-[1.2]">
        {children}
      </span>
    </div>
  );
}

export function AgencyDetails({ agency }: { agency: AgencyData }) {
  const domain = (() => {
    try {
      return new URL(agency.website).hostname.replace(/^www\./, "");
    } catch {
      return agency.website;
    }
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* Pricing + website row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[#545454]/60">
              Starting at
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.3px] text-black">
              {agency.priceFrom}
            </span>
          </div>
          <div className="h-7 w-px bg-[#69527A]/10" />
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[#545454]/60">
              Min. budget
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.3px] text-black">
              {agency.minBudget}
            </span>
          </div>
        </div>

        <a
          href={agency.website}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 text-[13px] font-medium text-[#483953] active:scale-[0.98] [&:hover_span]:underline"
        >
          <span className="underline-offset-2">{domain}</span>
          <ExternalIcon />
        </a>
      </div>

      {/* Description */}
      <p className="text-[14px] leading-[21px] tracking-[-0.1px] text-[#545454]">
        {agency.description}
      </p>

      {/* Services */}
      <div className="flex flex-wrap items-center gap-1.5">
        {agency.services.map((service) => (
          <ServicePill key={service}>{service}</ServicePill>
        ))}
      </div>
    </div>
  );
}

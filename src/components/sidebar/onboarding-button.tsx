"use client";

import { useState, useCallback, useRef, useEffect, type SVGProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.33333 0C3.73096 0 0 3.73096 0 8.33333C0 12.9357 3.73096 16.6667 8.33333 16.6667C12.9357 16.6667 16.6667 12.9357 16.6667 8.33333C16.6667 3.73096 12.9357 0 8.33333 0ZM11.3171 6.64577C11.5356 6.37862 11.4963 5.98486 11.2291 5.76628C10.962 5.5477 10.5682 5.58707 10.3496 5.85423L7.03693 9.90305L5.85861 8.72472C5.61453 8.48065 5.2188 8.48065 4.97472 8.72472C4.73065 8.9688 4.73065 9.36453 4.97472 9.60861L6.64139 11.2753C6.76625 11.4001 6.93811 11.4664 7.11447 11.4576C7.29083 11.4488 7.45524 11.3658 7.56706 11.2291L11.3171 6.64577Z" fill="currentColor"/>
    </svg>
  );
}

function PersonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.76107 0C4.69 0 3.01107 1.67893 3.01107 3.75C3.01107 5.82107 4.69 7.5 6.76107 7.5C8.83214 7.5 10.5111 5.82107 10.5111 3.75C10.5111 1.67893 8.83214 0 6.76107 0Z" fill="currentColor"/>
      <path d="M6.7623 8.33333C3.56905 8.33333 1.12512 10.2469 0.132775 12.93C-0.150917 13.6971 0.0433127 14.4532 0.494278 14.9906C0.933755 15.5144 1.61217 15.8333 2.343 15.8333H11.1816C11.9124 15.8333 12.5909 15.5144 13.0303 14.9906C13.4813 14.4532 13.6755 13.6971 13.3918 12.93C12.3995 10.2469 9.95555 8.33333 6.7623 8.33333Z" fill="currentColor"/>
    </svg>
  );
}

function ChainLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.00634 4.55372C5.63353 2.92654 8.27172 2.92654 9.8989 4.55372L10.1849 4.83967C10.8651 5.5199 11.2617 6.37902 11.3728 7.2657C11.43 7.72237 11.1062 8.13895 10.6495 8.19615C10.1928 8.25336 9.77626 7.92954 9.71905 7.47287C9.6524 6.94077 9.41548 6.42732 9.00635 6.01819L8.72039 5.73223C7.74408 4.75592 6.16117 4.75592 5.18486 5.73223L2.3989 8.51819C1.42259 9.4945 1.42259 11.0774 2.3989 12.0537L2.68486 12.3397C3.66117 13.316 5.24408 13.316 6.22039 12.3397L6.36334 12.1967C6.68876 11.8713 7.2164 11.8712 7.54185 12.1967C7.8673 12.5221 7.86732 13.0497 7.54189 13.3752L7.39892 13.5182C5.77174 15.1453 3.13353 15.1454 1.50634 13.5182L1.22039 13.2322C-0.406795 11.605 -0.406798 8.96686 1.22039 7.33968L4.00634 4.55372Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.83963 1.22039C11.4668 -0.406797 14.105 -0.406795 15.7322 1.22039L16.0181 1.50634C17.6453 3.13353 17.6453 5.77171 16.0181 7.3989L13.2322 10.1849C11.605 11.812 8.96681 11.812 7.33963 10.1849L7.05367 9.8989C6.37345 9.21867 5.97681 8.35955 5.86574 7.47287C5.80853 7.0162 6.13236 6.59962 6.58902 6.54241C7.04569 6.48521 7.46227 6.80903 7.51948 7.2657C7.58613 7.7978 7.82305 8.31125 8.23219 8.72039L8.51814 9.00634C9.49445 9.98265 11.0774 9.98265 12.0537 9.00634L14.8396 6.22039C15.8159 5.24408 15.8159 3.66117 14.8396 2.68485L14.5537 2.3989C13.5774 1.42262 11.9945 1.42259 11.0182 2.39882C11.0182 2.39885 11.0182 2.3988 11.0182 2.39882L10.8753 2.54179C10.5499 2.86727 10.0223 2.86734 9.69677 2.54195C9.37129 2.21655 9.37122 1.68892 9.69662 1.36344L9.83963 1.22039Z" fill="currentColor"/>
    </svg>
  );
}

function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9085 0.11952C12.5209 -0.393616 14.1667 0.809717 14.1667 2.50179V3.6607C15.6044 4.03074 16.6667 5.33582 16.6667 6.88902C16.6667 8.44222 15.6044 9.7473 14.1667 10.1173V11.2762C14.1667 12.9683 12.5209 14.1716 10.9085 13.6585L9.69942 13.2737C9.17404 14.4226 8.01467 15.2224 6.66667 15.2224C4.82572 15.2224 3.33333 13.73 3.33333 11.889V11.2399L1.74012 10.7316C0.703624 10.4009 0 9.43787 0 8.3499V5.42814C0 4.34017 0.703626 3.37711 1.74012 3.04642L3.81318 2.38501C3.85189 2.36674 3.89224 2.35136 3.93394 2.33915L10.9085 0.11952ZM5 11.7782V11.889C5 12.8095 5.74619 13.5557 6.66667 13.5557C7.26668 13.5557 7.79403 13.2383 8.08768 12.7608L5 11.7782ZM15 6.88902C15 7.50592 14.6648 8.04454 14.1667 8.33272V5.44532C14.6648 5.7335 15 6.27212 15 6.88902ZM3.33516 4.28696V9.49107L2.24671 9.1438C1.90121 9.03357 1.66667 8.71255 1.66667 8.3499V5.42814C1.66667 5.06548 1.90121 4.74446 2.24671 4.63423L3.33516 4.28696Z" fill="currentColor"/>
    </svg>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.89545 0.718521C9.43523 -0.239505 8.06809 -0.239508 7.60786 0.71852L5.63944 4.81606L1.1055 5.40972C0.0543692 5.54735 -0.383309 6.84619 0.399327 7.58416L3.71258 10.7083L2.88108 15.1687C2.68366 16.2277 3.80481 17.0128 4.73106 16.5135L8.75166 14.3459L12.7723 16.5135C13.6985 17.0128 14.8197 16.2277 14.6222 15.1687L13.7907 10.7083L17.104 7.58416C17.8866 6.84619 17.4489 5.54735 16.3978 5.40972L11.8639 4.81606L9.89545 0.718521Z" fill="currentColor"/>
    </svg>
  );
}

function EmptyCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="9.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const STEPS = [
  {
    id: "account",
    label: "Create agency account",
    description: "You're all set!",
    icon: null,
  },
  {
    id: "profile",
    label: "Complete your agency profile",
    description: "Add logo, description, team members and portfolio",
    icon: PersonIcon,
  },
  {
    id: "brand",
    label: "Add your first brand client",
    description: "Connect a brand to start managing their campaigns",
    icon: ChainLinkIcon,
  },
  {
    id: "campaign",
    label: "Launch first campaign",
    description: "Create a CPM, retainer, or per-video campaign for your brand",
    icon: MegaphoneIcon,
  },
  {
    id: "recruit",
    label: "Recruit creators",
    description: "Upload content and start earning",
    icon: StarIcon,
  },
];

function ProgressCircle({ progress }: { progress: number }) {
  const size = 100;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = progress * circumference;
  const gap = circumference - dash;

  return (
    <svg width={12} height={12} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={strokeWidth}
      />
      {progress > 0 && (
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{ strokeDasharray: `${dash} ${gap}` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </svg>
  );
}

export function OnboardingButton() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(["account"]));
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const progress = completed.size / STEPS.length;

  return (
    <div ref={containerRef} className="fixed bottom-0 right-0 z-40 m-5">
      {/* Popover - positioned above button */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full right-0 mb-2 w-[320px] origin-bottom-right overflow-hidden rounded-xl shadow-lg ring-1 ring-border"
          >
            {/* Header */}
            <div className="bg-[#151515] px-4 pb-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-white">
                  Complete setup
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-white/60">
                  {completed.size} of {STEPS.length}
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-white/60">
                Finish setting up your workspace to get the most out of Dub
              </p>
            </div>

            {/* Steps */}
            <div className="bg-card-bg p-2">
              <div className="overflow-hidden rounded-lg">
                {STEPS.map((step, i) => {
                  const done = completed.has(step.id);
                  return (
                    <div key={step.id}>
                      {i > 0 && (
                        <div className="pl-[32px]">
                          <div className="h-px bg-page-border" />
                        </div>
                      )}
                      <button
                        onClick={() => toggle(step.id)}
                        className="group flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left"
                      >
                        <div className="shrink-0">
                          <AnimatePresence mode="wait" initial={false}>
                            {done ? (
                              <motion.div
                                key="done"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <CheckCircleIcon className="size-5 text-[#00B36E]" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="todo"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <EmptyCircleIcon className="size-5 text-page-text-muted" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span
                            className={cn(
                              "font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] transition-colors",
                              done
                                ? "text-page-text-muted line-through"
                                : "text-page-text",
                            )}
                          >
                            {step.label}
                          </span>
                          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-subtle">
                            {step.description}
                          </span>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-page-text-muted transition-transform duration-150 group-hover:translate-x-0.5"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-2 flex h-7 w-full cursor-pointer items-center justify-center rounded-lg bg-[rgba(37,37,37,0.06)] font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-75 hover:bg-[rgba(37,37,37,0.1)] active:scale-[0.98] dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"
              >
                Dismiss guide
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#252525] bg-[#151515] px-3 shadow-md transition-all",
          "font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-white",
          "hover:bg-[#252525] hover:ring-4 hover:ring-border",
          "outline-none focus-visible:ring-4 focus-visible:ring-border",
        )}
      >
        Complete setup
        <ProgressCircle progress={progress} />
      </motion.button>
    </div>
  );
}

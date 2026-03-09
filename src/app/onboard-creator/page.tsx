import {
  CheckCircle,
  Link,
  Compass,
  ListVideo,
  ArrowRight,
} from "lucide-react";
import ContentRewardsLogo from "@/assets/icons/content-rewards-logo.svg";
import { ThemeDebugMenu } from "@/components/discover/shared/ThemeDebugMenu";

const steps = [
  {
    title: "Create your account",
    description: "You're all set!",
    completed: true,
    icon: CheckCircle,
  },
  {
    title: "Connect your social accounts",
    description: "Link your TikTok, YouTube and/or Instagram.",
    completed: false,
    icon: Link,
    action: { label: "Connect accounts", href: "/onboard-creator/connect" },
  },
  {
    title: "Join your first campaign",
    description: "Browse and apply to brand campaigns.",
    completed: false,
    icon: Compass,
    action: { label: "Browse campaigns", href: "#" },
  },
  {
    title: "Submit your first video",
    description: "Upload content and start earning",
    completed: false,
    icon: ListVideo,
    action: { label: "Submit content", href: "#" },
  },
];

export default function OnboardCreatorPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <ThemeDebugMenu />

      {/* Background gradients */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{
          background: [
            "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255, 63, 213, 0.24) 0%, rgba(255, 63, 213, 0) 100%)",
            "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255, 144, 37, 0.24) 0%, rgba(255, 144, 37, 0) 100%)",
          ].join(", "),
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 md:items-start md:p-8">
        {/* Welcome banner */}
        <div className="flex w-full flex-1 flex-col items-center gap-5 rounded-[20px] py-8">
          {/* Center column */}
          <div className="flex w-full max-w-[600px] flex-1 flex-col items-center justify-center">
            {/* Header section */}
            <div className="flex w-full flex-col items-center gap-4 pb-6">
              {/* Avatars row */}
              <div className="flex flex-row items-center drop-shadow-[0_-1px_3px_rgba(0,0,0,0.06)] drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {/* App logo orb */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)]"
                  style={{
                    background: [
                      "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.005) 100%)",
                      "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.32) 0%, rgba(255,63,213,0) 100%)",
                      "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.32) 0%, rgba(255,144,37,0) 100%)",
                      "#FF9025",
                    ].join(", "),
                    boxShadow:
                      "inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 0.972px 0px rgba(255,255,255,0.36)",
                  }}
                >
                  <ContentRewardsLogo className="h-[31px] w-[28px] text-white" />
                </div>

                {/* User avatar */}
                <div className="-ml-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)] shadow-[0_0_0_2px_#FFFFFF] dark:border-[rgba(255,255,255,0.15)] dark:shadow-[0_0_0_2px_#151515]">
                  <div className="h-full w-full bg-gradient-to-br from-orange-300 to-pink-300" />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-1.5 px-5">
                <h1 className="text-lg font-medium tracking-[-0.02em] text-black dark:text-white md:text-xl">
                  Welcome, Vlad!
                </h1>
                <p className="text-xs tracking-[-0.02em] text-black/72 dark:text-white/72 md:text-base">
                  Complete these steps to make your first money.
                </p>
              </div>
            </div>

            {/* Steps card */}
            <div className="flex w-full flex-col items-center gap-4 rounded-[20px] border border-black/[0.06] bg-white p-6 dark:border-white/[0.06] dark:bg-[#151515]">
              {steps.map((step, i) => (
                <div key={step.title} className="flex w-full flex-col gap-4">
                  {i > 0 && (
                    <div className="pl-[52px]">
                      <div className="h-px w-full bg-black/[0.06] dark:bg-white/[0.06]" />
                    </div>
                  )}

                  <div className="flex flex-row items-center gap-3">
                    {/* Step indicator */}
                    {step.completed ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00B36E] shadow-[0_0_0_2px_#FFFFFF] dark:shadow-[0_0_0_2px_#151515]">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-[0_0_0_2px_#FFFFFF] dark:border-white/[0.06] dark:bg-[#151515] dark:shadow-[0_0_0_2px_#151515]">
                        <step.icon className="h-5 w-5 text-black/72 dark:text-white/72" />
                      </div>
                    )}

                    {/* Text */}
                    <div
                      className={`flex flex-1 flex-col justify-center gap-1 ${step.completed ? "opacity-50" : ""}`}
                    >
                      <span className="text-xs font-medium tracking-[-0.02em] text-black dark:text-white md:text-sm">
                        {step.title}
                      </span>
                      <span className="text-xs tracking-[-0.02em] text-black/72 dark:text-white/72 md:text-sm">
                        {step.description}
                      </span>
                    </div>

                    {/* Action button - arrow on mobile, text on desktop */}
                    {step.action && (
                      <a
                        href={step.action.href}
                        className="glass-hover flex shrink-0 items-center justify-center rounded-full bg-black/5 p-2 active:scale-[0.98] dark:bg-white/10 md:px-4 md:py-2"
                      >
                        <ArrowRight className="h-4 w-4 text-black dark:text-white md:hidden" />
                        <span className="hidden text-sm font-medium tracking-[-0.02em] text-black dark:text-white md:inline">
                          {step.action.label}
                        </span>
                      </a>
                    )}

                    {/* Completed step - dimmed arrow on mobile */}
                    {step.completed && (
                      <a
                        href="#"
                        className="flex shrink-0 items-center justify-center rounded-full bg-black/5 p-2 opacity-40 dark:bg-white/10 md:hidden"
                      >
                        <ArrowRight className="h-4 w-4 text-black dark:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

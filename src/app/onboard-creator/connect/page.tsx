"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Instagram,
  X,
  ChevronLeft,
  Compass,
} from "lucide-react";
import TikTokIcon from "@/assets/icons/tiktok.svg";
import YoutubeIcon from "@/assets/icons/youtube.svg";
import CopyIcon from "@/assets/icons/copy.svg";
import CircleCheckFilled from "@/assets/icons/circle-check-filled.svg";
import { ThemeDebugMenu } from "@/components/discover/shared/ThemeDebugMenu";

const platforms = [
  {
    name: "TikTok",
    icon: TikTokIcon,
    iconClass: "h-[17px] w-[15px]",
    iconColor: "text-black dark:text-white",
    dialogIconColor: "text-[#FF3FD5]",
    dialogBg: "rgba(255, 63, 213, 0.07)",
  },
  {
    name: "Youtube",
    icon: YoutubeIcon,
    iconClass: "h-[17px] w-[21px]",
    iconColor: "text-[#FF0000]",
    dialogIconColor: "text-[#FF0000]",
    dialogBg: "rgba(255, 0, 0, 0.07)",
  },
  {
    name: "Instagram",
    icon: Instagram,
    iconClass: "h-6 w-6",
    iconColor: "text-[#962FBF]",
    dialogIconColor: "text-[#962FBF]",
    dialogBg: "rgba(150, 47, 191, 0.07)",
  },
];

type DialogStep = "username" | "code" | "success";

function CodeDigit({ digit }: { digit: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-base font-medium tracking-[-0.02em] text-black shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#151515] dark:text-white dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      {digit}
    </div>
  );
}

export default function ConnectAccountsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    (typeof platforms)[number] | null
  >(null);
  const [username, setUsername] = useState("");
  const [dialogStep, setDialogStep] = useState<DialogStep>("username");
  const [verificationCode] = useState("146903");
  const [connectedAccounts, setConnectedAccounts] = useState<
    Record<string, string>
  >({});

  const hasAnyConnected = Object.keys(connectedAccounts).length > 0;

  const closeDialog = () => {
    if (dialogStep === "success" && selectedPlatform) {
      setConnectedAccounts((prev) => ({
        ...prev,
        [selectedPlatform.name]: username,
      }));
    }
    setSelectedPlatform(null);
    setDialogStep("username");
    setUsername("");
  };

  const handleGenerateCode = () => {
    if (username.trim()) {
      setDialogStep("code");
    }
  };

  const handleCopyCode = () => {
    const formatted = `${verificationCode.slice(0, 3)}-${verificationCode.slice(3)}`;
    navigator.clipboard.writeText(formatted);
  };

  const handleDisconnect = (platformName: string) => {
    setConnectedAccounts((prev) => {
      const next = { ...prev };
      delete next[platformName];
      return next;
    });
  };

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
        <div className="flex w-full flex-1 flex-col items-center gap-5 rounded-[20px] pt-8">
          {/* Center column */}
          <div className="flex w-full max-w-[600px] flex-1 flex-col items-center justify-center">
            {/* Header section */}
            <div className="flex w-full flex-col items-center gap-4 pb-6">
              {/* Link icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#151515]">
                <LinkIcon className="h-6 w-6 text-black/72 dark:text-white/72" />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center gap-1.5 px-5">
                <h1 className="text-lg font-medium tracking-[-0.02em] text-black dark:text-white md:text-xl">
                  Connect your social accounts
                </h1>
                <p className="text-center text-xs tracking-[-0.02em] text-black/72 dark:text-white/72 md:text-base">
                  Link your TikTok, YouTube and/or Instagram and start browsing
                  campaigns.
                </p>
              </div>
            </div>

            {/* Platform cards */}
            <div className="flex w-full flex-row items-center justify-center gap-4 pb-4">
              {platforms.map((platform) => {
                const isConnected = !!connectedAccounts[platform.name];
                const connectedUsername = connectedAccounts[platform.name];

                return (
                  <div
                    key={platform.name}
                    className={`relative flex flex-1 flex-col items-center gap-5 rounded-[20px] border p-5 ${
                      isConnected
                        ? "border-[#00B26E] shadow-[0_0_0_2px_rgba(0,178,110,0.1),0_1px_2px_rgba(0,0,0,0.03)]"
                        : "border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                    } bg-white dark:bg-[#151515]`}
                  >
                    {/* Status dot */}
                    {isConnected ? (
                      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#00B26E] shadow-[0_0_0_2px_rgba(0,178,110,0.1)]" />
                    ) : (
                      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-black/20 dark:bg-white/20" />
                    )}

                    {/* Icon + name */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-[0_0_0_2px_#FFFFFF] dark:border-white/[0.06] dark:bg-[#151515] dark:shadow-[0_0_0_2px_#151515]">
                          <platform.icon
                            className={`${platform.iconClass} ${platform.iconColor}`}
                          />
                        </div>
                        {/* Connected avatar badge */}
                        {isConnected && (
                          <div className="absolute -bottom-0.5 right-0 h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-orange-300 to-pink-300 dark:border-[#151515]" />
                        )}
                      </div>
                      {isConnected ? (
                        <span className="text-center text-base font-medium tracking-[-0.02em] text-[#00B26E]">
                          @{connectedUsername}
                        </span>
                      ) : (
                        <span className="text-base font-medium tracking-[-0.02em] text-black dark:text-white">
                          {platform.name}
                        </span>
                      )}
                    </div>

                    {/* Action button */}
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnect(platform.name)}
                        className="glass-hover flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium tracking-[-0.02em] text-black/72 active:scale-[0.98] dark:text-white/72"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setUsername("");
                          setDialogStep("username");
                        }}
                        className="glass-hover flex items-center justify-center rounded-full bg-black/5 px-4 py-2 text-sm font-medium tracking-[-0.02em] text-black active:scale-[0.98] dark:bg-white/10 dark:text-white"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom action buttons (shown when at least one account connected) */}
            {hasAnyConnected && (
              <div className="flex w-full items-center gap-2 pt-0">
                <a
                  href="/onboard-creator"
                  className="glass-hover flex flex-1 items-center justify-center rounded-full bg-black/5 py-2.5 text-sm font-medium tracking-[-0.02em] text-black active:scale-[0.98] dark:bg-white/10 dark:text-white"
                >
                  Back home
                </a>
                <a
                  href="#"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-all active:scale-[0.98]"
                  style={{
                    background: [
                      "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.005) 100%)",
                      "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.32) 0%, rgba(255,63,213,0) 100%)",
                      "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.32) 0%, rgba(255,144,37,0) 100%)",
                      "linear-gradient(0deg, #252525, #252525)",
                    ].join(", "),
                  }}
                >
                  <Compass className="h-4 w-4 text-white" />
                  Browse campaigns
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog overlay */}
      {selectedPlatform && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60"
          onClick={closeDialog}
        >
          <div
            className="relative flex w-full max-w-[400px] flex-col items-center rounded-[20px] bg-white shadow-[0_24px_48px_-8px_rgba(0,0,0,0.2)] dark:bg-[#151515] dark:shadow-[0_24px_48px_-8px_rgba(0,0,0,0.5)] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back button (code step only) */}
            {dialogStep === "code" && (
              <button
                onClick={() => setDialogStep("username")}
                className="glass-hover absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] active:scale-[0.95] dark:bg-white/[0.06]"
              >
                <ChevronLeft className="h-4 w-4 text-black/30 dark:text-white/30" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={closeDialog}
              className="glass-hover absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] active:scale-[0.95] dark:bg-white/[0.06]"
            >
              <X className="h-4 w-4 text-black/30 dark:text-white/30" />
            </button>

            {/* Dialog content */}
            <div className="flex w-full flex-col items-center gap-4 p-5">
              {/* Icon + text */}
              <div className="flex w-full flex-col items-center gap-4">
                {/* Icon */}
                {dialogStep === "success" ? (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(0, 178, 110, 0.07)",
                      boxShadow:
                        "inset 0px 1.25px 0px rgba(255, 255, 255, 0.36)",
                    }}
                  >
                    <CircleCheckFilled className="h-5 w-5 text-[#00B26E]" />
                  </div>
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background: selectedPlatform.dialogBg,
                      boxShadow:
                        "inset 0px 1.25px 0px rgba(255, 255, 255, 0.36)",
                    }}
                  >
                    <selectedPlatform.icon
                      className={`${selectedPlatform.iconClass} opacity-80 ${selectedPlatform.dialogIconColor}`}
                    />
                  </div>
                )}

                {/* Title + description */}
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-lg font-medium tracking-[-0.02em] text-black dark:text-white">
                    {dialogStep === "success"
                      ? "Account connected"
                      : `Connect ${selectedPlatform.name}`}
                  </h2>
                  <p className="max-w-[300px] text-center text-sm leading-[150%] tracking-[-0.02em] text-black/72 dark:text-white/72">
                    {dialogStep === "username"
                      ? "Search for your account, then generate a unique verification code."
                      : dialogStep === "code"
                        ? `Paste the code into your ${selectedPlatform.name} bio, return here, and click Verify.`
                        : `Your ${selectedPlatform.name} account is verified and ready to use.`}
                  </p>
                </div>
              </div>

              {/* Step-specific content */}
              {dialogStep === "username" && (
                <div className="flex w-full flex-col gap-2">
                  <label className="text-xs tracking-[-0.02em] text-black/56 dark:text-white/56">
                    {selectedPlatform.name} username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`${selectedPlatform.name} username`}
                    className="w-full rounded-full border border-black/[0.06] !bg-white px-3.5 py-3 text-sm tracking-[-0.02em] text-black shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-150 placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/20 dark:border-white/[0.06] dark:!bg-[#1a1a1a] dark:text-white dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:placeholder:text-white/40 dark:focus:ring-white/20"
                  />
                </div>
              )}
              {dialogStep === "code" && (
                <div className="flex w-full items-center justify-center gap-3 py-2 pb-4">
                  <div className="flex flex-1 items-center justify-center gap-2">
                    {verificationCode
                      .slice(0, 3)
                      .split("")
                      .map((d, i) => (
                        <CodeDigit key={i} digit={d} />
                      ))}
                  </div>
                  <span className="text-sm tracking-[-0.02em] text-black/56 dark:text-white/56">
                    –
                  </span>
                  <div className="flex flex-1 items-center justify-center gap-2">
                    {verificationCode
                      .slice(3)
                      .split("")
                      .map((d, i) => (
                        <CodeDigit key={i + 3} digit={d} />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex w-full gap-2 px-5 pb-5">
              {dialogStep === "username" ? (
                <button
                  onClick={handleGenerateCode}
                  disabled={!username.trim()}
                  className="flex w-full items-center justify-center rounded-full bg-black py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-all active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100 dark:bg-white dark:text-black"
                >
                  Generate code
                </button>
              ) : dialogStep === "code" ? (
                <>
                  <button
                    onClick={handleCopyCode}
                    className="glass-hover flex flex-1 items-center justify-center gap-2 rounded-full bg-black/5 py-2.5 text-sm font-medium tracking-[-0.02em] text-black active:scale-[0.98] dark:bg-white/10 dark:text-white"
                  >
                    <CopyIcon className="h-3 w-3 text-black dark:text-white" />
                    Copy code
                  </button>
                  <button
                    onClick={() => setDialogStep("success")}
                    className="flex flex-1 items-center justify-center rounded-full bg-black py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-all active:scale-[0.98] dark:bg-white dark:text-black"
                  >
                    Verify account
                  </button>
                </>
              ) : (
                <button
                  onClick={closeDialog}
                  className="flex w-full items-center justify-center rounded-full bg-black py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-all active:scale-[0.98] dark:bg-white dark:text-black"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

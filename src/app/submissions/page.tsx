"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";

// ── Filter Icon ─────────────────────────────────────────────────────

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 0.75H12.75M4.75 10.0833H8.75M2.75 5.41667H10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Icons ───────────────────────────────────────────────────────────

function ClockIcon({ color = "currentColor", size = 12 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.2" />
      <path d="M6 3V6L8 7" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon({ color = "#00B259", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM9.18264 5.42218C9.41579 5.13721 9.37379 4.7172 9.08882 4.48405C8.80386 4.2509 8.38385 4.2929 8.15069 4.57786L5.61717 7.67439L4.80474 6.86195C4.54439 6.6016 4.12228 6.6016 3.86193 6.86195C3.60158 7.1223 3.60158 7.54441 3.86193 7.80476L5.19526 9.13809C5.32845 9.27128 5.51176 9.34191 5.69988 9.33253C5.88799 9.32314 6.06337 9.23462 6.18264 9.08885L9.18264 5.42218Z" fill={color} />
    </svg>
  );
}

function XCircleIcon({ color = "#FF2525", size = 11 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 10 / 11)} viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.71555 0.744194C4.29437 -0.248063 5.72807 -0.248066 6.30689 0.744193L9.81585 6.75956C10.3992 7.75954 9.67787 9.01537 8.52019 9.01537H1.50226C0.344574 9.01537 -0.376734 7.75955 0.206591 6.75956L3.71555 0.744194ZM5.01172 3.01538C5.28786 3.01538 5.51172 3.23924 5.51172 3.51538V5.01538C5.51172 5.29152 5.28786 5.51538 5.01172 5.51538C4.73558 5.51538 4.51172 5.29152 4.51172 5.01538V3.51538C4.51172 3.23924 4.73558 3.01538 5.01172 3.01538ZM4.38672 6.51538C4.38672 6.1702 4.66654 5.89038 5.01172 5.89038C5.3569 5.89038 5.63672 6.1702 5.63672 6.51538C5.63672 6.86056 5.3569 7.14038 5.01172 7.14038C4.66654 7.14038 4.38672 6.86056 4.38672 6.51538Z" fill={color} />
    </svg>
  );
}

function SparkleIcon({ color = "currentColor", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.30522 0.475101C7.22062 0.193112 6.96107 0 6.66667 0C6.37226 0 6.11271 0.193112 6.02812 0.475101C5.54855 2.07364 4.92691 3.21362 4.07026 4.07026C3.21362 4.92691 2.07364 5.54855 0.475101 6.02812C0.193112 6.11271 0 6.37226 0 6.66667C0 6.96107 0.193112 7.22062 0.475101 7.30522C2.07364 7.78478 3.21362 8.40642 4.07026 9.26307C4.92691 10.1197 5.54855 11.2597 6.02812 12.8582C6.11271 13.1402 6.37226 13.3333 6.66667 13.3333C6.96107 13.3333 7.22062 13.1402 7.30522 12.8582C7.78478 11.2597 8.40642 10.1197 9.26307 9.26307C10.1197 8.40642 11.2597 7.78478 12.8582 7.30522C13.1402 7.22062 13.3333 6.96107 13.3333 6.66667C13.3333 6.37226 13.1402 6.11271 12.8582 6.02812C11.2597 5.54855 10.1197 4.92691 9.26307 4.07026C8.40642 3.21362 7.78478 2.07364 7.30522 0.475101Z" fill={color} />
    </svg>
  );
}

function DotMenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.25" fill="currentColor" className="opacity-50" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" className="opacity-50" />
      <circle cx="8" cy="13" r="1.25" fill="currentColor" className="opacity-50" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5V7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5V1.5Z" fill="white"/>
      <path d="M5 1.5C5 0.671573 5.67157 0 6.5 0C7.32843 0 8 0.671573 8 1.5V7.5C8 8.32843 7.32843 9 6.5 9C5.67157 9 5 8.32843 5 7.5V1.5Z" fill="white"/>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/>
      <path d="M9.38908 0.612652C9.19381 0.41739 8.87723 0.41739 8.68197 0.612652C8.48671 0.807914 8.48671 1.1245 8.68197 1.31976C9.49686 2.13465 9.99999 3.25896 9.99999 4.50174C9.99999 5.74452 9.49686 6.86883 8.68197 7.68372C8.48671 7.87898 8.48671 8.19556 8.68197 8.39083C8.87723 8.58609 9.19381 8.58609 9.38908 8.39083C10.3838 7.39607 11 6.02038 11 4.50174C11 2.98309 10.3838 1.60741 9.38908 0.612652Z" fill="white"/>
      <path d="M7.7981 2.20347C7.60284 2.00821 7.28626 2.00821 7.091 2.20347C6.89573 2.39873 6.89573 2.71532 7.091 2.91058C7.49871 3.3183 7.75001 3.88011 7.75001 4.50157C7.75001 5.12303 7.49871 5.68484 7.091 6.09256C6.89573 6.28782 6.89573 6.6044 7.091 6.79967C7.28626 6.99493 7.60284 6.99493 7.7981 6.79967C8.38569 6.21208 8.75001 5.39889 8.75001 4.50157C8.75001 3.60424 8.38569 2.79106 7.7981 2.20347Z" fill="white"/>
    </svg>
  );
}

function VolumeMutedIcon() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/>
      <path d="M8.35355 2.85489C8.15829 2.65963 7.84171 2.65963 7.64645 2.85489C7.45118 3.05015 7.45118 3.36674 7.64645 3.562L9.08579 5.00133L7.64645 6.44067C7.45118 6.63593 7.45118 6.95251 7.64645 7.14778C7.84171 7.34304 8.15829 7.34304 8.35355 7.14778L9.79289 5.70844L11.2322 7.14778C11.4275 7.34304 11.7441 7.34304 11.9393 7.14778C12.1346 6.95251 12.1346 6.63593 11.9393 6.44067L10.5 5.00133L11.9393 3.562C12.1346 3.36674 12.1346 3.05015 11.9393 2.85489C11.7441 2.65963 11.4275 2.65963 11.2322 2.85489L9.79289 4.29423L8.35355 2.85489Z" fill="white"/>
    </svg>
  );
}

function CaptionIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C10 0.671573 9.32843 0 8.5 0H1.5C0.671573 0 0 0.671573 0 1.5V6.5C0 7.32843 0.671573 8 1.5 8H2V9C2 9.18014 2.0969 9.34635 2.25365 9.4351C2.41041 9.52385 2.60278 9.52143 2.75725 9.42875L5.13849 8H8.5C9.32843 8 10 7.32843 10 6.5V1.5ZM2.1239 4C2.1239 4.34518 2.40372 4.625 2.7489 4.625C3.09408 4.625 3.3739 4.34518 3.3739 4C3.3739 3.65482 3.09408 3.375 2.7489 3.375C2.40372 3.375 2.1239 3.65482 2.1239 4ZM4.3739 4C4.3739 4.34518 4.65372 4.625 4.9989 4.625C5.34408 4.625 5.6239 4.34518 5.6239 4C5.6239 3.65482 5.34408 3.375 4.9989 3.375C4.65372 3.375 4.3739 3.65482 4.3739 4ZM7.2489 4.625C6.90372 4.625 6.6239 4.34518 6.6239 4C6.6239 3.65482 6.90372 3.375 7.2489 3.375C7.59408 3.375 7.8739 3.65482 7.8739 4C7.8739 4.34518 7.59408 4.625 7.2489 4.625Z" fill="white"/>
    </svg>
  );
}

function ExpandIcon({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 0.5C5 0.223858 5.22386 0 5.5 0H8.5C8.77614 0 9 0.223858 9 0.5V3.5C9 3.77614 8.77614 4 8.5 4C8.22386 4 8 3.77614 8 3.5V1.70711L5.85355 3.85355C5.65829 4.04882 5.34171 4.04882 5.14645 3.85355C4.95118 3.65829 4.95118 3.34171 5.14645 3.14645L7.29289 1H5.5C5.22386 1 5 0.776142 5 0.5ZM0.5 5C0.776142 5 1 5.22386 1 5.5V7.29289L3.14645 5.14645C3.34171 4.95118 3.65829 4.95118 3.85355 5.14645C4.04882 5.34171 4.04882 5.65829 3.85355 5.85355L1.70711 8H3.5C3.77614 8 4 8.22386 4 8.5C4 8.77614 3.77614 9 3.5 9H0.5C0.223858 9 0 8.77614 0 8.5V5.5C0 5.22386 0.223858 5 0.5 5Z" fill="white"/>
    </svg>
  );
}

function ShrinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 6C9.22386 6 9 5.77614 9 5.5V2.5C9 2.22386 9.22386 2 9.5 2C9.77614 2 10 2.22386 10 2.5V4.29289L12.1464 2.14645C12.3417 1.95118 12.6583 1.95118 12.8536 2.14645C13.0488 2.34171 13.0488 2.65829 12.8536 2.85355L10.7071 5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H9.5ZM2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L5 10.7071V12.5C5 12.7761 5.22386 13 5.5 13C5.77614 13 6 12.7761 6 12.5V9.5C6 9.22386 5.77614 9 5.5 9H2.5C2.22386 9 2 9.22386 2 9.5C2 9.77614 2.22386 10 2.5 10H4.29289L2.14645 12.1464Z" fill="white"/>
    </svg>
  );
}

function TikTokIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M11.5 1.33C10.98 0.76 10.69 0.04 10.68 0H8.46V10.4C8.44 11.5 7.54 12.39 6.44 12.39C5.34 12.39 4.44 11.5 4.44 10.39C4.44 9.28 5.34 8.39 6.44 8.39C6.65 8.39 6.85 8.42 7.04 8.48V6.23C6.84 6.2 6.64 6.18 6.44 6.18C4.12 6.18 2.22 8.08 2.22 10.39C2.22 12.7 4.12 14.61 6.44 14.61C8.76 14.61 10.66 12.7 10.66 10.39V5.08C11.54 5.71 12.6 6.06 13.68 6.06V3.83C12.78 3.83 11.97 3.72 11.5 1.33Z" fill="currentColor"/>
    </svg>
  );
}

function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4.66667 4.66667L11.3333 11.3333M11.3333 4.66667L4.66667 11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PaperclipAttachIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.66667 8.66667L9.33333 6C10.0697 5.26362 10.0697 4.06971 9.33333 3.33333C8.59695 2.59695 7.40305 2.59695 6.66667 3.33333L3.33333 6.66667C2.0 8 2.0 10.1333 3.33333 11.3333C4.66667 12.6667 6.66667 12.6667 8 11.3333L11.3333 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EmptyCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" className="opacity-30" strokeWidth="1.5" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4 0H1.5C0.671573 0 0 0.671573 0 1.5V8.5C0 9.32843 0.671573 10 1.5 10H6.5C7.32843 10 8 9.32843 8 8.5V4H5.5C4.67157 4 4 3.32843 4 2.5V0ZM2 6C2 5.72386 2.22386 5.5 2.5 5.5H4C4.27614 5.5 4.5 5.72386 4.5 6C4.5 6.27614 4.27614 6.5 4 6.5H2.5C2.22386 6.5 2 6.27614 2 6ZM2.5 7.5C2.22386 7.5 2 7.72386 2 8C2 8.27614 2.22386 8.5 2.5 8.5H5.75C6.02614 8.5 6.25 8.27614 6.25 8C6.25 7.72386 6.02614 7.5 5.75 7.5H2.5Z" fill="currentColor" className="opacity-50" />
      <path d="M7.70711 3L5 0.292893V2.5C5 2.77614 5.22386 3 5.5 3H7.70711Z" fill="currentColor" className="opacity-50" />
    </svg>
  );
}

function VideoClipIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 3C0 1.34315 1.34315 0 3 0H7C8.65685 0 10 1.34315 10 3V6C10 7.65685 8.65685 9 7 9H0.5C0.223858 9 0 8.77614 0 8.5V3ZM3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H6.5C6.77614 4 7 3.77614 7 3.5C7 3.22386 6.77614 3 6.5 3H3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6H5C5.27614 6 5.5 5.77614 5.5 5.5C5.5 5.22386 5.27614 5 5 5H3.5Z" fill="currentColor" className="opacity-50" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" className="opacity-50" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────

type SubmissionStatus = "pending" | "accepted" | "rejected";
type QualityResult = "pass" | "fail";

interface CheckItem {
  name: string;
  detail: string;
  score: number;
  passed: boolean;
}

interface Submission {
  id: string;
  creator: string;
  avatar: string;
  platform: "tiktok" | "instagram";
  platforms: ("tiktok" | "instagram")[];
  campaign: string;
  date: string;
  timeLeft: string;
  status: SubmissionStatus;
  aiScore: number;
  aiResult: QualityResult;
  checksPassed: number;
  checksTotal: number;
  payout: string;
  engRate: string;
  botScore: number;
  botScoreColor: string;
  views: string;
  viewsNum: string;
  likes: string;
  likesNum: string;
  comments: string;
  commentsNum: string;
  shares: string;
  sharesNum: string;
  topCountry: string;
  countryCode: string;
  topAge: string;
  videoUrl: string;
  videoDuration: string;
  videoCurrentTime: string;
  overviewText: string;
  contentChecks: CheckItem[];
  visualChecks: CheckItem[];
  appliedDate: string;
  motivation: string;
  tiktokAccounts: number;
  instagramAccounts: number;
}

// ── Mock Data ───────────────────────────────────────────────────────

const SUBMISSIONS: Submission[] = [
  {
    id: "1",
    creator: "xKaizen",
    avatar: "https://i.pravatar.cc/36?u=xkaizen",
    platform: "tiktok",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "25 Feb '26",
    timeLeft: "1d left",
    status: "pending",
    aiScore: 23,
    aiResult: "fail",
    checksPassed: 1,
    checksTotal: 13,
    payout: "$690",
    engRate: "4.3%",
    botScore: 12,
    botScoreColor: "#FF2525",
    views: "1,2M",
    viewsNum: "1.2M",
    likes: "48,2K",
    likesNum: "48.2K",
    comments: "3,1K",
    commentsNum: "3.1K",
    shares: "1,3K",
    sharesNum: "1.3K",
    topCountry: "United Kingdom",
    countryCode: "gb",
    topAge: "18-24",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoDuration: "01:15",
    videoCurrentTime: "00:21",
    overviewText: "Failed 12 of 13 checks. No brand mentions, stock audio, and below-minimum video quality — not eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    visualChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    appliedDate: "2 Mar, 2026",
    motivation: "I've been creating tech content for 2 years and my audience loves discovering new tools. I specialize in productivity hacks and AI reviews. My engagement rate consistently outperforms the niche average.",
    tiktokAccounts: 3,
    instagramAccounts: 3,
  },
  {
    id: "2",
    creator: "Cryptoclipz",
    avatar: "https://i.pravatar.cc/36?u=cryptoclipz",
    platform: "instagram",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "26 Feb '26",
    timeLeft: "2d left",
    status: "pending",
    aiScore: 92,
    aiResult: "pass",
    checksPassed: 13,
    checksTotal: 13,
    payout: "$275",
    engRate: "3.8%",
    botScore: 89,
    botScoreColor: "#00B259",
    views: "1,1M",
    viewsNum: "1.1M",
    likes: "56,9K",
    likesNum: "56.9K",
    comments: "1,4K",
    commentsNum: "1.4K",
    shares: "3,8K",
    sharesNum: "3.8K",
    topCountry: "United Kingdom",
    countryCode: "gb",
    topAge: "18-24",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    videoDuration: "01:15",
    videoCurrentTime: "00:21",
    overviewText: "Passed all 13 checks. Content matches the brief, brand mentioned 4 times, and video meets all quality requirements. Eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    visualChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    appliedDate: "28 Feb, 2026",
    motivation: "I've been creating fashion content for 3 years and my audience loves discovering new brands. I specialize in minimalist style and sustainable fashion. My engagement rate consistently outperforms the niche average, which means the brands I promote actually get results.",
    tiktokAccounts: 2,
    instagramAccounts: 4,
  },
  {
    id: "3",
    creator: "ViralVee",
    avatar: "https://i.pravatar.cc/36?u=viralvee",
    platform: "tiktok",
    platforms: ["tiktok"],
    campaign: "FitTrack Pro",
    date: "27 Feb '26",
    timeLeft: "3d left",
    status: "pending",
    aiScore: 78,
    aiResult: "pass",
    checksPassed: 10,
    checksTotal: 13,
    payout: "$425",
    engRate: "5.1%",
    botScore: 72,
    botScoreColor: "#E9A23B",
    views: "890K",
    viewsNum: "890K",
    likes: "34,1K",
    likesNum: "34.1K",
    comments: "2,8K",
    commentsNum: "2.8K",
    shares: "5,2K",
    sharesNum: "5.2K",
    topCountry: "United States",
    countryCode: "us",
    topAge: "25-34",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    videoDuration: "00:58",
    videoCurrentTime: "00:34",
    overviewText: "Passed 10 of 13 checks. Good brand integration and authentic delivery. Minor issues with hashtag placement and end-screen CTA missing.",
    contentChecks: [
      { name: "Audio Match", detail: "Original audio", score: 95, passed: true },
      { name: "Video Match", detail: "Content aligned", score: 88, passed: true },
      { name: "Talking Points", detail: "3/4 covered", score: 75, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 3x", score: 82, passed: true },
      { name: "Title & Tags", detail: "Missing 2 tags", score: 45, passed: false },
      { name: "Sentiment", detail: "Positive tone", score: 90, passed: true },
      { name: "Language", detail: "English, fluent", score: 95, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p verified", score: 92, passed: true },
      { name: "Lighting", detail: "Good natural light", score: 85, passed: true },
      { name: "Framing", detail: "Well composed", score: 88, passed: true },
      { name: "Brand Logo", detail: "Visible at 0:12", score: 78, passed: true },
      { name: "End Screen", detail: "CTA missing", score: 20, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "1 Mar, 2026",
    motivation: "Fitness content is my passion and I've built a loyal community of 500K+ followers who trust my product recommendations. I only promote products I genuinely use and believe in.",
    tiktokAccounts: 1,
    instagramAccounts: 0,
  },
  {
    id: "4",
    creator: "TechTalksDaily",
    avatar: "https://i.pravatar.cc/36?u=techtalksdaily",
    platform: "instagram",
    platforms: ["instagram"],
    campaign: "NovaPay Wallet",
    date: "28 Feb '26",
    timeLeft: "5d left",
    status: "pending",
    aiScore: 45,
    aiResult: "fail",
    checksPassed: 5,
    checksTotal: 13,
    payout: "$1,200",
    engRate: "2.1%",
    botScore: 34,
    botScoreColor: "#FF2525",
    views: "2,4M",
    viewsNum: "2.4M",
    likes: "18,3K",
    likesNum: "18.3K",
    comments: "890",
    commentsNum: "890",
    shares: "2,1K",
    sharesNum: "2.1K",
    topCountry: "India",
    countryCode: "in",
    topAge: "18-24",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    videoDuration: "01:32",
    videoCurrentTime: "00:45",
    overviewText: "Failed 8 of 13 checks. High view count but low engagement ratio suggests inorganic traffic. Brand messaging was off-brief and product shown incorrectly.",
    contentChecks: [
      { name: "Audio Match", detail: "Background music too loud", score: 30, passed: false },
      { name: "Video Match", detail: "Off-brief content", score: 25, passed: false },
      { name: "Talking Points", detail: "1/4 covered", score: 20, passed: false },
      { name: "Brand Mentions", detail: "Wrong product name", score: 15, passed: false },
      { name: "Title & Tags", detail: "Correct tags used", score: 80, passed: true },
      { name: "Sentiment", detail: "Neutral tone", score: 55, passed: true },
      { name: "Language", detail: "English, clear", score: 88, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "720p only", score: 40, passed: false },
      { name: "Lighting", detail: "Too dark", score: 25, passed: false },
      { name: "Framing", detail: "Product cut off", score: 30, passed: false },
      { name: "Brand Logo", detail: "Not visible", score: 10, passed: false },
      { name: "End Screen", detail: "CTA present", score: 75, passed: true },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "3 Mar, 2026",
    motivation: "As a tech reviewer with 2M+ followers, I bring detailed and honest product analysis that drives real conversions. My audience skews 18-34 and is highly engaged with fintech content.",
    tiktokAccounts: 0,
    instagramAccounts: 2,
  },
  {
    id: "5",
    creator: "NightOwlEdits",
    avatar: "https://i.pravatar.cc/36?u=nightowledits",
    platform: "tiktok",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "1 Mar '26",
    timeLeft: "6d left",
    status: "pending",
    aiScore: 88,
    aiResult: "pass",
    checksPassed: 12,
    checksTotal: 13,
    payout: "$550",
    engRate: "6.7%",
    botScore: 94,
    botScoreColor: "#00B259",
    views: "3,1M",
    viewsNum: "3.1M",
    likes: "124K",
    likesNum: "124K",
    comments: "8,9K",
    commentsNum: "8.9K",
    shares: "12,4K",
    sharesNum: "12.4K",
    topCountry: "Germany",
    countryCode: "de",
    topAge: "25-34",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    videoDuration: "01:05",
    videoCurrentTime: "00:52",
    overviewText: "Passed 12 of 13 checks. Exceptional engagement metrics and authentic storytelling. Only minor issue: one talking point slightly paraphrased.",
    contentChecks: [
      { name: "Audio Match", detail: "Original voiceover", score: 98, passed: true },
      { name: "Video Match", detail: "Perfect match", score: 95, passed: true },
      { name: "Talking Points", detail: "3/4 exact match", score: 72, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 5x", score: 96, passed: true },
      { name: "Title & Tags", detail: "All tags present", score: 100, passed: true },
      { name: "Sentiment", detail: "Very positive", score: 97, passed: true },
      { name: "Language", detail: "English, native", score: 99, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "4K verified", score: 100, passed: true },
      { name: "Lighting", detail: "Studio quality", score: 95, passed: true },
      { name: "Framing", detail: "Professional", score: 92, passed: true },
      { name: "Brand Logo", detail: "Clear at 0:08", score: 90, passed: true },
      { name: "End Screen", detail: "Strong CTA", score: 88, passed: true },
      { name: "Watermark", detail: "Subtle branding", score: 45, passed: false },
    ],
    appliedDate: "4 Mar, 2026",
    motivation: "Creative storytelling is what sets my content apart. I've collaborated with 20+ brands and consistently deliver content that exceeds KPIs. My editing style is cinematic and attention-grabbing.",
    tiktokAccounts: 3,
    instagramAccounts: 2,
  },
  {
    id: "6",
    creator: "FitnessWithMaya",
    avatar: "https://i.pravatar.cc/36?u=fitnesswithmaya",
    platform: "instagram",
    platforms: ["instagram", "tiktok"],
    campaign: "FitTrack Pro",
    date: "2 Mar '26",
    timeLeft: "7d left",
    status: "pending",
    aiScore: 61,
    aiResult: "pass",
    checksPassed: 8,
    checksTotal: 13,
    payout: "$380",
    engRate: "4.9%",
    botScore: 67,
    botScoreColor: "#E9A23B",
    views: "456K",
    viewsNum: "456K",
    likes: "22,1K",
    likesNum: "22.1K",
    comments: "1,9K",
    commentsNum: "1.9K",
    shares: "3,4K",
    sharesNum: "3.4K",
    topCountry: "Brazil",
    countryCode: "br",
    topAge: "18-24",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoDuration: "01:48",
    videoCurrentTime: "01:12",
    overviewText: "Passed 8 of 13 checks. Good product demonstration and genuine enthusiasm. Audio quality needs improvement and some brand guidelines not followed.",
    contentChecks: [
      { name: "Audio Match", detail: "Echo detected", score: 35, passed: false },
      { name: "Video Match", detail: "Mostly aligned", score: 70, passed: true },
      { name: "Talking Points", detail: "2/4 covered", score: 50, passed: false },
      { name: "Brand Mentions", detail: "Mentioned 2x", score: 65, passed: true },
      { name: "Title & Tags", detail: "Partial tags", score: 55, passed: true },
      { name: "Sentiment", detail: "Enthusiastic", score: 92, passed: true },
      { name: "Language", detail: "English, accented", score: 78, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p verified", score: 90, passed: true },
      { name: "Lighting", detail: "Mixed lighting", score: 50, passed: false },
      { name: "Framing", detail: "Shaky at times", score: 42, passed: false },
      { name: "Brand Logo", detail: "Brief appearance", score: 60, passed: true },
      { name: "End Screen", detail: "No CTA", score: 15, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "5 Mar, 2026",
    motivation: "I'm a certified personal trainer who creates authentic fitness content. My followers trust my recommendations because I only promote products I've personally tested and believe in.",
    tiktokAccounts: 1,
    instagramAccounts: 3,
  },
  {
    id: "7",
    creator: "CodeWithSam",
    avatar: "https://i.pravatar.cc/36?u=codewithsam",
    platform: "tiktok",
    platforms: ["tiktok"],
    campaign: "NovaPay Wallet",
    date: "3 Mar '26",
    timeLeft: "8d left",
    status: "pending",
    aiScore: 15,
    aiResult: "fail",
    checksPassed: 2,
    checksTotal: 13,
    payout: "$0",
    engRate: "0.4%",
    botScore: 8,
    botScoreColor: "#FF2525",
    views: "12K",
    viewsNum: "12K",
    likes: "89",
    likesNum: "89",
    comments: "12",
    commentsNum: "12",
    shares: "3",
    sharesNum: "3",
    topCountry: "Nigeria",
    countryCode: "ng",
    topAge: "13-17",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    videoDuration: "00:32",
    videoCurrentTime: "00:08",
    overviewText: "Failed 11 of 13 checks. Content appears to be entirely unrelated to the campaign. Suspected re-upload of existing content with no modifications.",
    contentChecks: [
      { name: "Audio Match", detail: "Unrelated audio", score: 3, passed: false },
      { name: "Video Match", detail: "No relation", score: 2, passed: false },
      { name: "Talking Points", detail: "None followed", score: 0, passed: false },
      { name: "Brand Mentions", detail: "Zero mentions", score: 0, passed: false },
      { name: "Title & Tags", detail: "Wrong category", score: 8, passed: false },
      { name: "Sentiment", detail: "Irrelevant", score: 10, passed: false },
      { name: "Language", detail: "English, basic", score: 55, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "480p only", score: 15, passed: false },
      { name: "Lighting", detail: "Very poor", score: 10, passed: false },
      { name: "Framing", detail: "Random footage", score: 5, passed: false },
      { name: "Brand Logo", detail: "Not present", score: 0, passed: false },
      { name: "End Screen", detail: "None", score: 0, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "6 Mar, 2026",
    motivation: "Looking to expand my content portfolio into brand partnerships. I have experience with coding tutorials and tech reviews.",
    tiktokAccounts: 1,
    instagramAccounts: 0,
  },
  {
    id: "8",
    creator: "SkincareSophie",
    avatar: "https://i.pravatar.cc/36?u=skincaresophie",
    platform: "instagram",
    platforms: ["instagram", "tiktok"],
    campaign: "Caffeine AI",
    date: "4 Mar '26",
    timeLeft: "9d left",
    status: "pending",
    aiScore: 95,
    aiResult: "pass",
    checksPassed: 13,
    checksTotal: 13,
    payout: "$820",
    engRate: "7.2%",
    botScore: 97,
    botScoreColor: "#00B259",
    views: "4,7M",
    viewsNum: "4.7M",
    likes: "210K",
    likesNum: "210K",
    comments: "15,2K",
    commentsNum: "15.2K",
    shares: "18,9K",
    sharesNum: "18.9K",
    topCountry: "Canada",
    countryCode: "ca",
    topAge: "25-34",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoDuration: "02:10",
    videoCurrentTime: "01:35",
    overviewText: "Perfect score — passed all 13 checks. Outstanding production quality, seamless brand integration, and exceptional audience engagement. Top performer this week.",
    contentChecks: [
      { name: "Audio Match", detail: "Crystal clear", score: 99, passed: true },
      { name: "Video Match", detail: "Exact brief match", score: 98, passed: true },
      { name: "Talking Points", detail: "4/4 covered", score: 100, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 6x", score: 100, passed: true },
      { name: "Title & Tags", detail: "All optimized", score: 95, passed: true },
      { name: "Sentiment", detail: "Highly positive", score: 98, passed: true },
      { name: "Language", detail: "English, eloquent", score: 99, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "4K HDR", score: 100, passed: true },
      { name: "Lighting", detail: "Professional", score: 98, passed: true },
      { name: "Framing", detail: "Cinematic", score: 96, passed: true },
      { name: "Brand Logo", detail: "Prominent", score: 94, passed: true },
      { name: "End Screen", detail: "Perfect CTA", score: 92, passed: true },
      { name: "Watermark", detail: "Clean", score: 100, passed: true },
    ],
    appliedDate: "7 Mar, 2026",
    motivation: "I've built a premium beauty and skincare community with 4.7M views on my last campaign. My audience is primarily 25-34 women with high purchasing power. Every brand I work with sees measurable ROI.",
    tiktokAccounts: 2,
    instagramAccounts: 3,
  },
];

const TABS = [
  { name: "All", count: 21 },
  { name: "Pending", count: 8 },
  { name: "Approved", count: 5 },
  { name: "Rejected", count: 5 },
  { name: "Flagged", count: 3 },
];

const SUBMISSION_FILTERS: Filter[] = [
  {
    key: "platform",
    icon: null,
    label: "Platform",
    singleSelect: true,
    options: [
      { value: "tiktok", label: "TikTok" },
      { value: "instagram", label: "Instagram" },
    ],
  },
  {
    key: "status",
    icon: null,
    label: "Status",
    singleSelect: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "accepted", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
];

// ── Fullscreen Comment Input ────────────────────────────────────────

function FullscreenCommentInput({ formatTime, currentTime }: { formatTime: (s: number) => string; currentTime: number }) {
  const [comment, setComment] = useState("");

  return (
    <div className="flex items-center gap-2">
      <div className="size-6 shrink-0 overflow-hidden rounded-md border border-foreground/[0.06] bg-page-text-muted/20" />
      <div className="flex h-10 flex-1 items-center gap-2 rounded-full border border-foreground/[0.06] bg-white pl-1 pr-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-card-bg">
        <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]"><PaperclipAttachIcon /></button>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && comment.trim()) {
              e.preventDefault();
              setComment("");
            }
          }}
          className="min-w-0 flex-1 bg-transparent font-inter text-sm leading-none tracking-[-0.02em] text-page-text outline-none placeholder:text-[rgba(37,37,37,0.4)] dark:placeholder:text-page-text-muted/40"
          placeholder="Leave a comment..."
        />
        {comment.trim() && (
          <button
            onClick={() => setComment("")}
            className="flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground px-3 dark:bg-white"
          >
            <span className="font-inter text-xs font-medium whitespace-nowrap tracking-[-0.02em] text-white dark:text-black">Comment at {formatTime(currentTime)}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Video Player ────────────────────────────────────────────────────

function VideoPlayer({
  src,
  platform,
  duration,
}: {
  src: string;
  platform: "tiktok" | "instagram";
  duration: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const fsBgVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [hoveredSpeed, setHoveredSpeed] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.75);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  const syncBg = useCallback(() => {
    const bg = bgVideoRef.current;
    const main = videoRef.current;
    if (bg && main) bg.currentTime = main.currentTime;
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    const bg = bgVideoRef.current;
    const fsBg = fsBgVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      if (bg) { bg.currentTime = video.currentTime; bg.play(); }
      if (fsBg) { fsBg.currentTime = video.currentTime; fsBg.play(); }
      setIsPlaying(true);
    } else {
      video.pause();
      if (bg) bg.pause();
      if (fsBg) fsBg.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setTotalDuration(video.duration);
    setIsLandscape(video.videoWidth > video.videoHeight);
  }, []);

  const progressRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const seekTo = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !video.duration || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = pct * video.duration;
    syncBg();
  }, [syncBg]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    seekTo(e.clientX);
    const onMouseMove = (ev: MouseEvent) => {
      seekTo(ev.clientX);
      // update hover during drag too
      const bar = progressRef.current;
      if (bar) {
        const rect = bar.getBoundingClientRect();
        setHoverPct(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)));
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [seekTo]);

  const handleBarMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPct(pct);

    // Draw thumbnail preview from video
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    if (video && canvas && video.duration) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pw = isLandscape ? 71 : 40;
        const ph = isLandscape ? 40 : 71;
        canvas.width = pw;
        canvas.height = ph;
        const targetTime = pct * video.duration;
        // Only draw if we're near the current time (seeking is async)
        if (Math.abs(video.currentTime - targetTime) < 1) {
          ctx.drawImage(video, 0, 0, pw, ph);
        }
      }
    }
  }, []);

  const handleBarMouseLeave = useCallback(() => {
    if (!isDragging.current) setHoverPct(null);
  }, []);

  const SPEEDS = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s);
    setSpeedOpen(false);
    const video = videoRef.current;
    if (video) video.playbackRate = s;
  }, []);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = volumeBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
    const video = videoRef.current;
    if (video) {
      video.volume = pct;
      video.muted = pct === 0;
    }
  }, []);

  const volumeFillRef = useRef<HTMLDivElement>(null);

  const applyVolume = useCallback((clientX: number) => {
    const bar = volumeBarRef.current;
    if (!bar) return 0;
    const r = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    if (volumeFillRef.current) volumeFillRef.current.style.width = `${pct * 100}%`;
    const video = videoRef.current;
    if (video) { video.volume = pct; video.muted = pct === 0; }
    return pct;
  }, []);

  const handleVolumeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    applyVolume(e.clientX);
    const onMove = (ev: MouseEvent) => applyVolume(ev.clientX);
    const onUp = (ev: MouseEvent) => {
      setVolume(applyVolume(ev.clientX));
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [applyVolume]);

  const openVolume = useCallback(() => {
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    setVolumeOpen(true);
  }, []);

  const closeVolumeDelayed = useCallback(() => {
    volumeTimerRef.current = setTimeout(() => setVolumeOpen(false), 300);
  }, []);

  // Close speed menu on outside click
  useEffect(() => {
    if (!speedOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-speed-menu]")) setSpeedOpen(false);
    };
    window.addEventListener("click", handler, { capture: true });
    return () => window.removeEventListener("click", handler, { capture: true });
  }, [speedOpen]);

  // ESC closes fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Sync playback state when videoRef switches between inline/fullscreen elements
  const prevFullscreen = useRef(false);
  const savedTime = useRef(0);
  useEffect(() => {
    if (prevFullscreen.current === isFullscreen) return;
    // Save current time before the ref switches
    savedTime.current = currentTime;
    prevFullscreen.current = isFullscreen;

    const syncVideo = () => {
      const v = videoRef.current;
      if (!v) return;

      const applyState = () => {
        v.currentTime = savedTime.current;
        v.playbackRate = speed;
        v.volume = volume;
        v.muted = volume === 0;
        if (isPlaying) v.play().catch(() => {});

        // Sync fullscreen background blur video
        const fsBg = fsBgVideoRef.current;
        if (fsBg) {
          fsBg.currentTime = savedTime.current;
          fsBg.playbackRate = speed;
          if (isPlaying) fsBg.play().catch(() => {});
        }
      };

      // If video is ready, sync immediately; otherwise wait for it
      if (v.readyState >= 2) {
        applyState();
      } else {
        v.addEventListener("canplay", applyState, { once: true });
      }
    };

    // Wait a frame for React to attach the ref to the new element
    requestAnimationFrame(syncVideo);
  }, [isFullscreen]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
    {/* Custom fullscreen overlay — portalled to body to escape overflow:hidden ancestors */}
    {typeof document !== "undefined" && createPortal(
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex overflow-hidden bg-black"
        >
          {/* Full-screen blurred background — synced with playback */}
          <video ref={fsBgVideoRef} src={src} className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover" style={{ filter: "blur(50px)" }} muted playsInline loop />
          <div className="pointer-events-none absolute inset-0 z-0 bg-black/40" />

          {/* Left: Video */}
          <div className="relative z-[1] flex flex-1 flex-col p-2">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-black">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[120px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)" }} />
              <video
                ref={isFullscreen ? videoRef : undefined}
                src={src}
                className={cn(
                  isLandscape
                    ? "relative z-[1] h-full w-full rounded-[20px] object-contain"
                    : "h-full object-cover",
                )}
                style={{ aspectRatio: isLandscape ? undefined : "9/16" }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                playsInline
                loop
              />
              <div className="absolute left-3 top-3 z-[3]"><div className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"><PlatformIcon platform={platform} size={16} className="text-white [&_path]:fill-white" /></div></div>
              <div className="absolute inset-0 z-[2] cursor-pointer" onClick={togglePlay} />
              <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col gap-[6px]" onClick={(e) => e.stopPropagation()}>
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  className="group relative flex h-4 cursor-pointer items-center px-3"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleBarMouseMove}
                  onMouseLeave={handleBarMouseLeave}
                >
                  {/* Hover preview tooltip */}
                  {hoverPct !== null && (
                    <div
                      className="pointer-events-none absolute bottom-6 flex -translate-x-1/2 flex-col items-center gap-1"
                      style={{ left: `${hoverPct * 100}%` }}
                    >
                      <div className="flex items-center overflow-hidden rounded-lg border-2 border-white/40 backdrop-blur-[12px]">
                        <canvas ref={previewCanvasRef} className="block" width={isLandscape ? 107 : 60} height={isLandscape ? 60 : 107} style={{ width: isLandscape ? 107 : 60, height: isLandscape ? 60 : 107 }} />
                      </div>
                      <div className="flex items-center rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
                        <span className="font-inter text-xs tracking-[-0.02em] text-white">{formatTime(hoverPct * totalDuration)}</span>
                      </div>
                    </div>
                  )}
                  {/* Track */}
                  <div className="relative h-1 w-full rounded-full bg-white/20">
                    {hoverPct !== null && hoverPct * 100 > progress && (
                      <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${hoverPct * 100}%`, background: "rgba(255,255,255,0.4)" }} />
                    )}
                    <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                    {/* Thumb */}
                    <div className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${progress}%` }}>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><rect width="6" height="12" rx="3" fill="white"/></svg>
                    </div>
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-1.5">
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                      {isPlaying ? (
                        <svg width="14" height="16" viewBox="0 0 8 9" fill="none"><path d="M0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5V7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5V1.5Z" fill="white"/><path d="M5 1.5C5 0.671573 5.67157 0 6.5 0C7.32843 0 8 0.671573 8 1.5V7.5C8 8.32843 7.32843 9 6.5 9C5.67157 9 5 8.32843 5 7.5V1.5Z" fill="white"/></svg>
                      ) : (
                        <svg width="16" height="18" viewBox="0 0 12 14" fill="none"><path d="M2 1L11 7L2 13V1Z" fill="white" /></svg>
                      )}
                    </button>
                    {/* Volume with expandable slider */}
                    <div className="relative flex items-center" onMouseEnter={openVolume} onMouseLeave={closeVolumeDelayed}>
                      <motion.div
                        className="flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-[12px]"
                        animate={{ width: volumeOpen ? 110 : 40, paddingLeft: 12, paddingRight: volumeOpen ? 10 : 12 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      >
                        <button
                          className="flex shrink-0 cursor-pointer items-center justify-center"
                          onClick={() => {
                            const video = videoRef.current;
                            if (!video) return;
                            if (video.muted || volume === 0) { video.muted = false; video.volume = 0.75; setVolume(0.75); }
                            else { video.muted = true; setVolume(0); }
                          }}
                        >
                          {volume === 0 ? (
                            <svg width="16" height="14" viewBox="0 0 11 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M8.35355 2.85489C8.15829 2.65963 7.84171 2.65963 7.64645 2.85489C7.45118 3.05015 7.45118 3.36674 7.64645 3.562L9.08579 5.00133L7.64645 6.44067C7.45118 6.63593 7.45118 6.95251 7.64645 7.14778C7.84171 7.34304 8.15829 7.34304 8.35355 7.14778L9.79289 5.70844L11.2322 7.14778C11.4275 7.34304 11.7441 7.34304 11.9393 7.14778C12.1346 6.95251 12.1346 6.63593 11.9393 6.44067L10.5 5.00133L11.9393 3.562C12.1346 3.36674 12.1346 3.05015 11.9393 2.85489C11.7441 2.65963 11.4275 2.65963 11.2322 2.85489L9.79289 4.29423L8.35355 2.85489Z" fill="white"/></svg>
                          ) : (
                            <svg width="16" height="14" viewBox="0 0 11 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M9.38908 0.612652C9.19381 0.41739 8.87723 0.41739 8.68197 0.612652C8.48671 0.807914 8.48671 1.1245 8.68197 1.31976C9.49686 2.13465 9.99999 3.25896 9.99999 4.50174C9.99999 5.74452 9.49686 6.86883 8.68197 7.68372C8.48671 7.87898 8.48671 8.19556 8.68197 8.39083C8.87723 8.58609 9.19381 8.58609 9.38908 8.39083C10.3838 7.39607 11 6.02038 11 4.50174C11 2.98309 10.3838 1.60741 9.38908 0.612652Z" fill="white"/><path d="M7.7981 2.20347C7.60284 2.00821 7.28626 2.00821 7.091 2.20347C6.89573 2.39873 6.89573 2.71532 7.091 2.91058C7.49871 3.3183 7.75001 3.88011 7.75001 4.50157C7.75001 5.12303 7.49871 5.68484 7.091 6.09256C6.89573 6.28782 6.89573 6.6044 7.091 6.79967C7.28626 6.99493 7.60284 6.99493 7.7981 6.79967C8.38569 6.21208 8.75001 5.39889 8.75001 4.50157C8.75001 3.60424 8.38569 2.79106 7.7981 2.20347Z" fill="white"/></svg>
                          )}
                        </button>
                        <AnimatePresence>
                          {volumeOpen && (
                            <motion.div
                              initial={{ opacity: 0, scaleX: 0 }}
                              animate={{ opacity: 1, scaleX: 1 }}
                              exit={{ opacity: 0, scaleX: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              style={{ transformOrigin: "left" }}
                              className="relative flex-1 cursor-pointer"
                              ref={volumeBarRef}
                              onMouseDown={handleVolumeMouseDown}
                            >
                              <div className="h-1.5 w-full rounded-full bg-white/20">
                                <div ref={volumeFillRef} className="h-full rounded-full bg-white/40" style={{ width: `${volume * 100}%` }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    {/* Captions */}
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C10 0.671573 9.32843 0 8.5 0H1.5C0.671573 0 0 0.671573 0 1.5V6.5C0 7.32843 0.671573 8 1.5 8H2V9C2 9.18014 2.0969 9.34635 2.25365 9.4351C2.41041 9.52385 2.60278 9.52143 2.75725 9.42875L5.13849 8H8.5C9.32843 8 10 7.32843 10 6.5V1.5ZM2.1239 4C2.1239 4.34518 2.40372 4.625 2.7489 4.625C3.09408 4.625 3.3739 4.34518 3.3739 4C3.3739 3.65482 3.09408 3.375 2.7489 3.375C2.40372 3.375 2.1239 3.65482 2.1239 4ZM4.3739 4C4.3739 4.34518 4.65372 4.625 4.9989 4.625C5.34408 4.625 5.6239 4.34518 5.6239 4C5.6239 3.65482 5.34408 3.375 4.9989 3.375C4.65372 3.375 4.3739 3.65482 4.3739 4ZM7.2489 4.625C6.90372 4.625 6.6239 4.34518 6.6239 4C6.6239 3.65482 6.90372 3.375 7.2489 3.375C7.59408 3.375 7.8739 3.65482 7.8739 4C7.8739 4.34518 7.59408 4.625 7.2489 4.625Z" fill="white"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-[12px]">
                    <span className="font-inter text-xs tracking-[-0.02em] text-white">{formatTime(currentTime)} / {duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Speed */}
                    <div className="relative" data-speed-menu>
                      <button onClick={() => setSpeedOpen((o) => !o)} className="flex h-10 cursor-pointer items-center justify-center gap-[1px] rounded-full bg-white/20 px-4 backdrop-blur-[12px]">
                        <span className="font-inter text-sm font-medium tracking-[0.1px] text-white">{speed.toFixed(1)}</span>
                        <span className="font-inter text-sm tracking-[0.1px] text-white/50">x</span>
                      </button>
                    </div>
                    {/* Shrink — inverse of ExpandIcon */}
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]" onClick={() => setIsFullscreen(false)}>
                      <svg width="14" height="14" viewBox="0 0 9 9" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L6.70711 3H8.5C8.77614 3 9 3.22386 9 3.5C9 3.77614 8.77614 4 8.5 4H5.5C5.22386 4 5 3.77614 5 3.5V0.5C5 0.223858 5.22386 0 5.5 0C5.77614 0 6 0.223858 6 0.5V2.29289L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447ZM0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L2.29289 6H0.5C0.223858 6 0 5.77614 0 5.5C0 5.22386 0.223858 5 0.5 5H3.5C3.77614 5 4 5.22386 4 5.5V8.5C4 8.77614 3.77614 9 3.5 9C3.22386 9 3 8.77614 3 8.5V6.70711L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Timeline */}
          <div className="relative z-[1] flex w-[320px] shrink-0 flex-col justify-end p-2 lg:w-[400px]">
            <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-foreground/[0.06] px-5 py-4">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Timeline</span>
                <button className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06]" onClick={() => setIsFullscreen(false)}><CloseIcon size={16} /></button>
              </div>
              <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
                {[
                  { name: "xKaizen", time: "Tue 24 Feb 4:37 AM", action: "Posted video", icon: "tiktok" },
                  { name: "xKaizen", time: "Wed 25 Feb 12:37 AM", action: "Submitted video", icon: "upload" },
                  { name: "Outpace Studios", time: "Wed 25 Feb 1:21 AM", action: "You're mentioning the wrong competitor", icon: "comment", timestamp: "00:08", isWorkspace: true },
                  { name: "xKaizen", time: "Wed 25 Feb 2:56 AM", action: "Fixed!", isReply: true },
                ].map((item, i) => (
                  <div key={i} className={cn("flex flex-col gap-2", item.isReply && "pl-[22px]")}>
                    <div className="flex items-center gap-2">
                      <div className={cn("size-4 shrink-0 bg-page-text-muted/30", item.isWorkspace ? "rounded" : "rounded-full")} />
                      <div className="flex flex-1 items-center gap-[6px]">
                        <span className="flex-1 font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{item.name}</span>
                        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{item.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-6">
                      {item.icon === "tiktok" && <TikTokIcon size={12} className="text-page-text-muted" />}
                      {item.icon === "upload" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-page-text-muted"><path d="M6 2V10M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      {item.timestamp && <span className="rounded-full border border-foreground/[0.06] bg-card-bg px-[6px] py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle">{item.timestamp}</span>}
                      <span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">{item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Comment input + actions */}
              <div className="flex flex-col gap-2 border-t border-foreground/[0.06] p-3">
                {/* Comment — collapsed pill / expanded card */}
                <FullscreenCommentInput formatTime={formatTime} currentTime={currentTime} />
                {/* Reject / Approve */}
                <div className="flex gap-2">
                  <button className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[rgba(255,37,37,0.06)] transition-colors hover:bg-[rgba(255,37,37,0.12)]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FF2525"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.25" strokeLinecap="round"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#FF2525]">Reject</span></button>
                  <button className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" className="fill-foreground"/><path d="M5 8L7 10L11 6" className="stroke-white dark:stroke-black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Approve</span></button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
    )}

    <div className="flex h-full flex-col p-1 pl-1">
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[20px] bg-black">
        {/* Blurred background for landscape videos */}
        {isLandscape && (
          <>
            <video
              ref={bgVideoRef}
              src={src}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover"
              style={{ filter: "blur(50px)" }}
              muted
              playsInline
              loop
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-black/20" />
          </>
        )}
        {/* Gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 68.18%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        />
        <video
          ref={!isFullscreen ? videoRef : undefined}
          src={src}
          className={cn(
            isLandscape
              ? "relative z-[1] w-full object-contain"
              : "h-full w-full object-cover",
          )}
          style={{ aspectRatio: isLandscape ? "16/9" : "9/16" }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          playsInline
          muted
          loop
        />

        {/* Overlay controls — hidden when fullscreen to avoid ref conflicts */}
        {!isFullscreen && <div className="absolute inset-0 z-[2] flex cursor-pointer flex-col justify-between p-2" onClick={togglePlay}>
          {/* Top bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
              <span className="font-inter text-xs tracking-[-0.02em] text-white">
                {formatTime(currentTime)} / {duration}
              </span>
            </div>
            <div className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
              <PlatformIcon platform={platform} size={12} className="text-white [&_path]:fill-white" />
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="group relative flex h-3 cursor-pointer items-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleBarMouseMove}
              onMouseLeave={handleBarMouseLeave}
            >
              {/* Hover preview tooltip */}
              {hoverPct !== null && (
                <div
                  className="pointer-events-none absolute bottom-5 -translate-x-1/2 flex flex-col items-center gap-1"
                  style={{ left: `${hoverPct * 100}%` }}
                >
                  {/* Thumbnail */}
                  <div className="flex items-center rounded-lg border-2 border-white/40 backdrop-blur-[12px] overflow-hidden">
                    <canvas
                      ref={previewCanvasRef}
                      className="block"
                      width={isLandscape ? 71 : 40}
                      height={isLandscape ? 40 : 71}
                      style={{ width: isLandscape ? 71 : 40, height: isLandscape ? 40 : 71 }}
                    />
                  </div>
                  {/* Time pill */}
                  <div className="flex items-center rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
                    <span className="font-inter text-xs tracking-[-0.02em] text-white">
                      {formatTime((hoverPct) * totalDuration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Track */}
              <div className="relative h-1 w-full rounded-full bg-white/20">
                {/* Buffer / hover-ahead zone */}
                {hoverPct !== null && hoverPct * 100 > progress && (
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${hoverPct * 100}%`,
                      background: "rgba(255, 255, 255, 0.4)",
                    }}
                  />
                )}
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Thumb */}
              <div
                className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${progress}%` }}
              >
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="6" height="12" rx="3" fill="white"/>
                </svg>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"
                >
                  {isPlaying ? <PauseIcon /> : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 1.5L10.5 6L3 10.5V1.5Z" fill="white" />
                    </svg>
                  )}
                </button>

                {/* Volume with expandable slider */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={openVolume}
                  onMouseLeave={closeVolumeDelayed}
                >
                  <motion.div
                    className="flex h-8 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-[12px]"
                    animate={{ width: volumeOpen ? 75 : 32, paddingLeft: 10, paddingRight: volumeOpen ? 8 : 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  >
                    <button
                      className="flex shrink-0 cursor-pointer items-center justify-center"
                      onClick={() => {
                        const video = videoRef.current;
                        if (!video) return;
                        if (video.muted || volume === 0) {
                          video.muted = false;
                          const restored = 0.75;
                          video.volume = restored;
                          setVolume(restored);
                        } else {
                          video.muted = true;
                          setVolume(0);
                        }
                      }}
                    >
                      {volume === 0 ? <VolumeMutedIcon /> : <VolumeIcon />}
                    </button>
                    <AnimatePresence>
                      {volumeOpen && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          style={{ transformOrigin: "left" }}
                          className="relative flex-1 cursor-pointer"
                          ref={volumeBarRef}
                          onMouseDown={handleVolumeMouseDown}
                        >
                          <div className="h-1.5 w-full rounded-full bg-white/20">
                            <div
                              ref={volumeFillRef}
                              className="h-full rounded-full bg-white/40"
                              style={{ width: `${volume * 100}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Captions */}
                <button className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                  <CaptionIcon />
                </button>
              </div>
              <div className="flex items-center gap-1">
                {/* Speed with popup menu */}
                <div className="relative" data-speed-menu>
                  <AnimatePresence>
                    {speedOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute bottom-10 right-0 flex w-[128px] flex-col rounded-[12px] bg-[rgba(51,51,51,0.9)] p-1 backdrop-blur-[12px]"
                        onMouseLeave={() => setHoveredSpeed(null)}
                      >
                        {/* Header */}
                        <div className="px-[10px] py-2">
                          <span className="font-inter text-xs tracking-[-0.02em] text-white/50">Speed</span>
                        </div>
                        {/* Options */}
                        <div className="relative flex flex-col">
                          {/* Fluid hover indicator */}
                          {hoveredSpeed !== null && hoveredSpeed !== speed && (
                            <motion.div
                              className="pointer-events-none absolute inset-x-0 h-7 rounded-lg bg-white/10"
                              layout
                              transition={{ type: "spring", stiffness: 800, damping: 40 }}
                              style={{ top: SPEEDS.indexOf(hoveredSpeed) * 28 }}
                            />
                          )}
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSpeedChange(s)}
                              onMouseEnter={() => setHoveredSpeed(s)}
                              className={cn(
                                "relative z-[1] flex cursor-pointer items-center gap-3 px-[10px] py-2 text-left",
                                s === speed && "rounded-lg bg-white/20",
                              )}
                            >
                              <div className="flex flex-1 items-center gap-[1px]">
                                <span className="font-inter text-xs font-medium leading-none tracking-[0.1px] text-white">
                                  {s.toFixed(1)}
                                </span>
                                <span className="font-inter text-xs font-normal leading-none tracking-[0.1px] text-white/50">x</span>
                              </div>
                              {s === speed && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setSpeedOpen((o) => !o)}
                    className="flex h-8 cursor-pointer items-center justify-center gap-[1px] rounded-full bg-white/20 px-3 backdrop-blur-[12px]"
                  >
                    <span className="font-inter text-xs font-medium tracking-[0.1px] text-white">{speed.toFixed(1)}</span>
                    <span className="font-inter text-xs tracking-[0.1px] text-white/50">x</span>
                  </button>
                </div>

                {/* Expand */}
                <button
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"
                  onClick={() => setIsFullscreen((f) => !f)}
                >
                  {isFullscreen ? <ShrinkIcon size={9} /> : <ExpandIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
    </>
  );
}

// ── Stat Mini Card ──────────────────────────────────────────────────

function StatMiniCard({
  value,
  label,
  valueColor,
  variant = "filled",
}: {
  value: string;
  label: string;
  valueColor?: string;
  variant?: "filled" | "outlined";
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col justify-center gap-2 rounded-2xl p-3",
        variant === "filled"
          ? "bg-foreground/[0.04]"
          : "border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none",
      )}
    >
      <span
        className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
      <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
        {label}
      </span>
    </div>
  );
}

// ── Metric Pill ─────────────────────────────────────────────────────

function MetricPill({
  label,
  value,
  color,
  bg,
  active = true,
  onClick,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-6 cursor-pointer items-center gap-1 rounded-full border py-2 pr-2 pl-1 transition-colors",
        active ? "border-transparent" : "border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none",
      )}
      style={{ backgroundColor: active ? bg : undefined }}
    >
      <div className="flex items-center gap-1">
        {active ? (
          <CheckCircleIcon color={color} size={16} />
        ) : (
          <EmptyCircleIcon />
        )}
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-inter text-xs leading-none tracking-[-0.02em]",
            active ? "text-page-text" : "text-page-text-subtle",
          )}>
            {label}
          </span>
          <span
            className={cn("font-inter text-xs font-medium leading-none tracking-[-0.02em]", !active && "text-page-text-subtle")}
            style={active ? { color } : undefined}
          >
            {value}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Performance Chart Data (analytics-poc format) ────────────────────

const SUBMISSIONS_CHART_POINTS = [
  { index: 0, label: "Jan 5", views: 8400, engagement: 3.2, likes: 1200, comments: 400, shares: 180 },
  { index: 1, label: "Jan 8", views: 12000, engagement: 4.1, likes: 2400, comments: 600, shares: 290 },
  { index: 2, label: "Jan 11", views: 28000, engagement: 5.0, likes: 4800, comments: 1400, shares: 480 },
  { index: 3, label: "Jan 14", views: 52000, engagement: 4.8, likes: 8200, comments: 2600, shares: 620 },
  { index: 4, label: "Jan 17", views: 74000, engagement: 4.5, likes: 10800, comments: 3200, shares: 710 },
  { index: 5, label: "Jan 20", views: 86000, engagement: 4.3, likes: 12400, comments: 3800, shares: 750 },
  { index: 6, label: "Jan 23", views: 92000, engagement: 4.6, likes: 13600, comments: 4200, shares: 780 },
  { index: 7, label: "Jan 26", views: 88000, engagement: 4.4, likes: 13000, comments: 4000, shares: 740 },
  { index: 8, label: "Jan 30", views: 82000, engagement: 4.2, likes: 12200, comments: 3600, shares: 690 },
  { index: 9, label: "Feb 2", views: 78000, engagement: 4.0, likes: 11800, comments: 3400, shares: 660 },
  { index: 10, label: "Feb 5", views: 72000, engagement: 3.8, likes: 11200, comments: 3000, shares: 600 },
];

const SUBMISSIONS_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    daily: SUBMISSIONS_CHART_POINTS,
    cumulative: SUBMISSIONS_CHART_POINTS,
  },
  leftDomain: [0, 100000],
  rightDomain: [0, 8],
  rightYLabels: ["8%", "6%", "4%", "2%", "0%"],
  series: [
    { axis: "left", color: "#4D81EE", domain: [0, 100000], key: "views", label: "Views", tooltipValueType: "number", yLabels: ["100k", "75k", "50k", "25k", "0"] },
    { axis: "left", color: "#DA5597", domain: [0, 15000], key: "likes", label: "Likes", tooltipValueType: "number", yLabels: ["15k", "11k", "7.5k", "3.75k", "0"] },
    { axis: "left", color: "#E9A23B", domain: [0, 5000], key: "comments", label: "Comments", tooltipValueType: "number", yLabels: ["5k", "3.75k", "2.5k", "1.25k", "0"] },
    { axis: "left", color: "#888888", domain: [0, 1000], key: "shares", label: "Shares", tooltipValueType: "number", yLabels: ["1k", "750", "500", "250", "0"] },
  ],
  xTicks: [
    { index: 0, label: "Jan 5" },
    { index: 2, label: "Jan 11" },
    { index: 4, label: "Jan 17" },
    { index: 6, label: "Jan 23" },
    { index: 8, label: "Jan 30" },
    { index: 10, label: "Feb 5" },
  ],
  yLabels: ["100k", "75k", "50k", "25k", "0"],
};

// ── Check Row ───────────────────────────────────────────────────────

function CheckRow({ check, isLast }: { check: CheckItem; isLast: boolean }) {
  return (
    <div className="flex items-center px-3 gap-2">
      {check.passed ? (
        <CheckCircleIcon color="#00B259" />
      ) : (
        <XCircleIcon color="#FF2525" />
      )}
      <div
        className={cn(
          "flex flex-1 items-center gap-2 py-3",
          !isLast && "border-b border-foreground/[0.06]",
        )}
      >
        <span className="flex-1 font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text-subtle">
          {check.name}
        </span>
        <span className="flex-1 text-right font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
          {check.detail}
        </span>
        <span
          className="w-[21px] text-right font-inter text-xs font-medium leading-none tracking-[-0.02em]"
          style={{ color: check.passed ? "#00B259" : "#FF2525" }}
        >
          {check.score}
        </span>
      </div>
    </div>
  );
}

// ── Check Section ───────────────────────────────────────────────────

function CheckSection({
  icon,
  title,
  passed,
  total,
  checks,
}: {
  icon: ReactNode;
  title: string;
  passed: number;
  total: number;
  checks: CheckItem[];
}) {
  const [expanded, setExpanded] = useState(true);
  const allFailed = passed === 0;

  return (
    <div className="overflow-hidden rounded-[10px] border border-foreground/[0.06] bg-card-bg">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 transition-colors hover:bg-foreground/[0.04]"
      >
        <div className="flex flex-1 items-center gap-1.5">
          {icon}
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            {title}
          </span>
        </div>
        <div
          className="flex items-center justify-center rounded-full border border-foreground/[0.06] px-1.5"
          style={{ height: 18 }}
        >
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF2626]">
            {passed}/{total}
          </span>
        </div>
        <div className={cn("ml-2 transition-transform", expanded && "rotate-180")}>
          <ChevronDownIcon />
        </div>
      </button>

      {/* Checks */}
      {expanded && (
        <div className="border-t border-foreground/[0.06]">
          {checks.map((check, i) => (
            <CheckRow key={check.name + i} check={check} isLast={i === checks.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Review Panel (scroll-aware gradient) ─────────────────────────

function AIReviewPanel({ submission, scoreColor, onAction }: { submission: Submission; scoreColor: string; onAction?: (action: "approve" | "reject") => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [canScroll, setCanScroll] = useState(false);

  const checkScrollable = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 4);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 8);
    setCanScroll(el.scrollHeight > el.clientHeight + 8);
  }, []);

  const handleScroll = checkScrollable;

  // Re-check when sections expand/collapse
  useEffect(() => {
    checkScrollable();
  }, [overviewOpen, checkScrollable]);

  // Re-check when content height changes (e.g. CheckSection toggle)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => checkScrollable());
    // Observe the scroll content, not the scroll container
    for (const child of el.children) ro.observe(child);
    return () => ro.disconnect();
  }, [checkScrollable]);

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-foreground/[0.06] lg:w-[360px]" style={{ minHeight: 0 }}>
      {/* Scrollable checks area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide relative min-h-0 flex-1 overflow-y-auto"
      >
        {/* Fade overlay — only visible when scrolled */}
        <div
          className="pointer-events-none sticky inset-x-0 top-0 z-10 h-[40px] transition-opacity duration-200"
          style={{
            background: "linear-gradient(180deg, var(--card-bg) 60%, transparent 100%)",
            opacity: canScroll && scrolled ? 1 : 0,
          }}
        />

        <div className="flex flex-col gap-2 px-3 pb-3 pt-2" style={{ marginTop: scrolled ? 0 : -40 }}>
          {/* Overview card */}
          <div className="overflow-hidden rounded-[10px] border border-foreground/[0.06] bg-card-bg">
            <button
              onClick={() => setOverviewOpen((o) => !o)}
              className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2.5 transition-colors hover:bg-foreground/[0.04]"
            >
              <ChatBubbleIcon />
              <span className="flex-1 text-left font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
                Overview
              </span>
              <div className={cn("transition-transform", overviewOpen && "rotate-180")}>
                <ChevronDownIcon />
              </div>
            </button>
            {overviewOpen && (
              <div className="border-t border-foreground/[0.06] px-3 py-3">
                <p className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text">
                  {submission.overviewText}
                </p>
              </div>
            )}
          </div>

          {/* Content checks */}
          <CheckSection
            icon={<FileTextIcon />}
            title="Content"
            passed={submission.contentChecks.filter((c) => c.passed).length}
            total={submission.contentChecks.length}
            checks={submission.contentChecks}
          />

          {/* Visual checks */}
          <CheckSection
            icon={<VideoClipIcon />}
            title="Visual"
            passed={submission.visualChecks.filter((c) => c.passed).length}
            total={submission.visualChecks.length}
            checks={submission.visualChecks}
          />
        </div>

        {/* Bottom fade overlay */}
        <div
          className="pointer-events-none sticky inset-x-0 bottom-0 z-10 -mt-[40px] h-[40px] transition-opacity duration-200"
          style={{
            background: "linear-gradient(0deg, var(--card-bg) 60%, transparent 100%)",
            opacity: canScroll && !atBottom ? 1 : 0,
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 p-3">
        <button
          onClick={() => onAction?.("reject")}
          className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(255,37,37,0.06)] transition-colors hover:bg-[rgba(255,37,37,0.12)] dark:bg-[rgba(255,37,37,0.12)] dark:hover:bg-[rgba(255,37,37,0.2)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FF2525"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.25" strokeLinecap="round"/></svg>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF2525]">
            Reject
          </span>
        </button>
        <button
          onClick={() => onAction?.("approve")}
          className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" className="fill-foreground"/><path d="M5 8L7 10L11 6" className="stroke-white dark:stroke-black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Approve
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Submission Card ─────────────────────────────────────────────────

function DotMenuPopover({ aiSummaryHidden, onToggleAiSummary }: { aiSummaryHidden: boolean; onToggleAiSummary: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        className="flex cursor-pointer items-center justify-center rounded-md p-1 hover:bg-foreground/[0.04]"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        type="button"
      >
        <DotMenuIcon />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            className="absolute right-0 top-full z-50 mt-1 w-[256px] rounded-xl border border-foreground/[0.06] bg-card-bg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          >
            <button
              className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]"
              onClick={() => setOpen(false)}
              type="button"
            >
              View profile
            </button>
            <button
              className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]"
              onClick={() => { onToggleAiSummary(); setOpen(false); }}
              type="button"
            >
              {aiSummaryHidden ? "Show AI summary" : "Hide AI summary"}
            </button>
            <button
              className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]"
              onClick={() => setOpen(false)}
              type="button"
            >
              Flag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmissionCard({ submission, onAction }: { submission: Submission; onAction?: (action: "approve" | "reject") => void }) {
  const isPass = submission.aiResult === "pass";
  const scoreColor = isPass ? "#00B259" : "#FF2525";
  const [aiSummaryHidden, setAiSummaryHidden] = useState(false);
  const [metricState, setMetricState] = useState<Record<string, boolean>>({
    views: true,
    likes: true,
    comments: true,
    shares: false,
  });
  const toggleMetric = useCallback((key: string) => {
    setMetricState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const visibleMetricKeys = useMemo(
    () => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k),
    [metricState],
  );

  return (
    <div className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
      {/* Header row */}
      <div className="flex items-center border-b border-foreground/[0.06]">
        {/* Creator info */}
        <div className="flex flex-1 items-center gap-3 px-3 py-3">
          <img
            src={submission.avatar}
            alt={submission.creator}
            className="size-9 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
              {submission.creator}
            </span>
            <div className="flex items-center gap-1">
              <PlatformIcon platform={submission.platform} size={12} className="opacity-50" />
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.campaign}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.date}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.timeLeft}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="ml-auto flex items-center gap-1 rounded-full bg-[rgba(255,144,37,0.1)] py-2 pr-2 pl-1.5">
            <ClockIcon color="#FF9025" />
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF9025]">
              Pending
            </span>
          </div>

          {/* Dot menu */}
          <div onClick={(e) => e.stopPropagation()}>
            <DotMenuPopover aiSummaryHidden={aiSummaryHidden} onToggleAiSummary={() => setAiSummaryHidden((v) => !v)} />
          </div>
        </div>

        {/* AI Quality section / Action buttons when summary hidden */}
        {aiSummaryHidden ? (
          <div className="flex w-[200px] shrink-0 items-center gap-2 border-l border-foreground/[0.06] px-3 py-3 lg:w-[280px]">
            <button
              onClick={() => onAction?.("reject")}
              className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(255,37,37,0.06)] transition-colors hover:bg-[rgba(255,37,37,0.12)] dark:bg-[rgba(255,37,37,0.12)] dark:hover:bg-[rgba(255,37,37,0.2)]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#FF2525"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.25" strokeLinecap="round"/></svg>
              <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF2525]">
                Reject
              </span>
            </button>
            <button
              onClick={() => onAction?.("approve")}
              className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" className="fill-foreground"/><path d="M5 8L7 10L11 6" className="stroke-white dark:stroke-black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
                Approve
              </span>
            </button>
          </div>
        ) : (
          <div className="flex w-[280px] shrink-0 flex-col gap-2 border-l border-foreground/[0.06] px-3 py-3 lg:w-[360px]">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5">
                <SparkleIcon color={scoreColor} />
                <span
                  className="font-inter text-sm font-medium leading-none tracking-[-0.02em]"
                  style={{ color: scoreColor }}
                >
                  {submission.aiScore}/100
                </span>
              </div>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
                AI Quality
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1">
                <span
                  className="font-inter text-sm font-medium leading-none tracking-[-0.02em]"
                  style={{ color: scoreColor }}
                >
                  {isPass ? "Pass" : "Fail"}
                </span>
              </div>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.checksPassed}/{submission.checksTotal} passed
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Body: 3-column layout */}
      <div className="flex" style={{ height: 380 }}>
        {/* Col 1: Video Player */}
        <div className="w-[200px] shrink-0 overflow-hidden lg:w-[260px]">
          <VideoPlayer
            src={submission.videoUrl}
            platform={submission.platform}
            duration={submission.videoDuration}
          />
        </div>

        {/* Col 2: Stats, Chart, Info */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
          {/* Stat cards */}
          <div className="flex gap-2">
            <StatMiniCard value={submission.payout} label="Payout" variant="filled" />
            <StatMiniCard value={submission.engRate} label="Eng. rate" variant="outlined" />
            <StatMiniCard
              value={`${submission.botScore}/100`}
              label="Bot score"
              valueColor={submission.botScoreColor}
              variant="outlined"
            />
          </div>

          {/* Performance chart card */}
          <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3">
            {/* Metric pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <MetricPill label="Views" value={submission.views} color="#4D81EE" bg="rgba(77,129,238,0.1)" active={metricState.views} onClick={() => toggleMetric("views")} />
              <MetricPill label="Likes" value={submission.likes} color="#DA5597" bg="rgba(218,85,151,0.1)" active={metricState.likes} onClick={() => toggleMetric("likes")} />
              <MetricPill label="Comments" value={submission.comments} color="#E9A23B" bg="rgba(233,162,59,0.1)" active={metricState.comments} onClick={() => toggleMetric("comments")} />
              <MetricPill label="Shares" value={submission.shares} color="var(--page-text-subtle)" bg="rgba(128,128,128,0.1)" active={metricState.shares} onClick={() => toggleMetric("shares")} />
            </div>

            {/* Chart */}
            <AnalyticsPocChartPlaceholder
              variant="line"
              chartStylePreset="performance-main"
              lineChart={SUBMISSIONS_CHART_DATA}
              activeLineDataset="daily"
              visibleMetricKeys={visibleMetricKeys}
              heightClassName="h-[172px]"
            />
          </div>

          {/* Bottom info row */}
          <div className="flex gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3">
              <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                Top country
              </span>
              <div className="flex min-w-0 items-center gap-1.5">
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${submission.countryCode}.svg`}
                  alt={submission.topCountry}
                  className="size-4 shrink-0 rounded-full"
                />
                <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                  {submission.topCountry}
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3">
              <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                Top age
              </span>
              <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                {submission.topAge}
              </span>
            </div>
          </div>

        </div>

        {/* Col 3: AI Review Panel */}
        {!aiSummaryHidden && (
          <AIReviewPanel submission={submission} scoreColor={scoreColor} onAction={onAction} />
        )}
      </div>

    </div>
  );
}

// ── Scroll Variants ──────────────────────────────────────────────────

type ScrollVariant = "snap" | "carousel" | "fade-in" | "blur-in" | "slide-up" | "stagger" | "spring-pop";

const VARIANT_LABELS: Record<ScrollVariant, string> = {
  snap: "Scroll Snap",
  carousel: "Carousel",
  "fade-in": "Fade In",
  "blur-in": "Blur Dissolve",
  "slide-up": "Slide Up",
  stagger: "Stagger Cascade",
  "spring-pop": "Spring Pop",
};

// ─ Variant A: CSS scroll-snap ─
function ScrollSnapList({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtTop(el.scrollTop < 4);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 4);
  }, []);

  return (
    <div className="relative mt-2">
      {/* Top gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 transition-opacity duration-200"
        style={{
          background: "linear-gradient(180deg, var(--page-bg) 0%, transparent 100%)",
          opacity: atTop ? 0 : 1,
        }}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex flex-col gap-2"
        style={{ scrollSnapType: "y mandatory", overflowY: "auto", maxHeight: "calc(100vh - 180px)" }}
      >
        {children}
      </div>
      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 transition-opacity duration-200"
        style={{
          background: "linear-gradient(0deg, var(--page-bg) 0%, transparent 100%)",
          opacity: atBottom ? 0 : 1,
        }}
      />
    </div>
  );
}

function ScrollSnapItem({ children }: { children: ReactNode }) {
  return (
    <div style={{ scrollSnapAlign: "start" }}>
      {children}
    </div>
  );
}

// ─ Variant B: Framer Motion carousel ─
const carouselVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -600 : 600, opacity: 0 }),
};

function CarouselList({ items }: { items: typeof SUBMISSIONS }) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([prev]) => {
        const next = prev + newDir;
        if (next < 0 || next >= items.length) return [prev, 0];
        return [next, newDir];
      });
    },
    [items.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate]);

  return (
    <div className="mt-2">
      {/* Carousel viewport */}
      <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SubmissionCard submission={items[page]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="flex size-8 items-center justify-center rounded-full bg-accent text-page-text disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > page ? 1 : -1])}
              className={cn(
                "size-2 rounded-full transition-all",
                i === page ? "scale-125 bg-foreground" : "bg-foreground/20",
              )}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={page === items.length - 1}
          className="flex size-8 items-center justify-center rounded-full bg-accent text-page-text disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const EXIT_ANIM = { opacity: 0, transition: { duration: 0.12 } };

// ─ Variant C: InView fade-in ─
function FadeInItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant D: Blur dissolve ─
function BlurInItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant E: Dramatic slide up ─
function SlideUpItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant F: Stagger cascade (index-based delay) ─
function StaggerItem({ children, index }: { children: ReactNode; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant G: Spring pop ─
function SpringPopItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}


// ── Page ─────────────────────────────────────────────────────────────

export default function SubmissionsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollVariant, setScrollVariant] = useState<ScrollVariant>("spring-pop");
  const [actions, setActions] = useState<Record<string, "approve" | "reject">>({});

  const handleAction = useCallback((id: string, action: "approve" | "reject") => {
    setActions((prev) => ({ ...prev, [id]: action }));
  }, []);

  const visibleSubmissions = SUBMISSIONS.filter((s) => !actions[s.id]);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarStuck, setToolbarStuck] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setToolbarStuck(!entry.isIntersecting),
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  return (
    <div ref={pageRef}>
      {/* Top nav */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Submissions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-1.5 rounded-full px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-accent">
            Understanding scores &amp; matches
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
          </button>

          <button className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-accent">
            Export
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.667V10M8 2.667L5.333 5.333M8 2.667L10.667 5.333M2.667 10.667V12C2.667 12.736 3.264 13.333 4 13.333H12C12.736 13.333 13.333 12.736 13.333 12V10.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-[21px] sm:px-6">
        {/* Toolbar — sticky on scroll */}
        <div
          ref={toolbarRef}
          className={cn(
            "sticky top-0 z-30 -mx-4 flex flex-col gap-3 px-4 py-3 sm:-mx-6 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-2",
            toolbarStuck
              ? "bg-page-bg shadow-[0_1px_0_0_var(--border),0_4px_12px_-2px_rgba(0,0,0,0.06)]"
              : "bg-transparent shadow-none",
          )}
        >
          {/* Tabs */}
          <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="scrollbar-hide overflow-x-auto">
            {TABS.map((tab, i) => (
              <TabItem
                key={tab.name}
                label={tab.name}
                count={tab.count}
                index={i}
              />
            ))}
          </Tabs>

          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card-bg px-3 md:w-[300px] md:flex-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 text-page-text-subtle"
              >
                <path
                  d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
              />
            </div>

            <FilterSelect
              filters={SUBMISSION_FILTERS}
              activeFilters={[]}
              onSelect={() => {}}
              onRemove={() => {}}
              searchPlaceholder="Filter..."
            >
              <button className="flex size-9 cursor-pointer items-center justify-center rounded-2xl bg-accent text-page-text transition-colors hover:bg-accent">
                <FilterIcon />
              </button>
            </FilterSelect>
          </div>
        </div>

        {/* Submission cards — rendered per active variant */}
        {scrollVariant === "snap" && (
          <ScrollSnapList>
            {visibleSubmissions.map((sub) => (
              <ScrollSnapItem key={sub.id}>
                <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
              </ScrollSnapItem>
            ))}
          </ScrollSnapList>
        )}

        {scrollVariant === "carousel" && <CarouselList items={visibleSubmissions} />}

        {scrollVariant === "fade-in" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <FadeInItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </FadeInItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "blur-in" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <BlurInItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </BlurInItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "slide-up" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <SlideUpItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </SlideUpItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "stagger" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub, i) => (
                <StaggerItem key={sub.id} index={i}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </StaggerItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "spring-pop" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <SpringPopItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </SpringPopItem>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}

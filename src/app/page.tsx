"use client";

import { useState, useCallback, useRef, useEffect, type SVGProps } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";
import { WorkspaceAvatar } from "@/components/sidebar/workspace-avatar";
import { cn } from "@/lib/utils";
import { NewCampaignButton } from "@/components/sidebar/new-campaign-dropdown";
import { RichButton } from "@/components/rich-button";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

// ── Icons ──────────────────────────────────────────────────────────

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

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 1.333L9.79 6.21 14.667 8 9.79 9.79 8 14.667 6.21 9.79 1.333 8 6.21 6.21 8 1.333z" fill="currentColor"/>
    </svg>
  );
}

function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.276 2.668L5.724 8l4.552 5.332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.724 2.668L10.276 8l-4.552 5.332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.33329 0.666016L11.3333 4.666L7.33329 8.66602M10.6666 4.666H0.666626" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 3.333V6h2.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M2.34 10A6 6 0 1 0 2 8" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" fill="none"/>
      <path d="M8 5.333V8l2 1.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function VideoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 0.5C1 0.223858 1.22386 0 1.5 0H8.5C8.77614 0 9 0.223858 9 0.5C9 0.776142 8.77614 1 8.5 1H1.5C1.22386 1 1 0.776142 1 0.5ZM0 3C0 2.17157 0.671573 1.5 1.5 1.5H8.5C9.32843 1.5 10 2.17157 10 3V7.5C10 8.32843 9.32843 9 8.5 9H1.5C0.671573 9 0 8.32843 0 7.5V3ZM4.28341 3.79935C4.45664 3.71609 4.66226 3.7395 4.81235 3.85957L6.06235 4.85957C6.18095 4.95445 6.25 5.09811 6.25 5.25C6.25 5.40189 6.18095 5.54555 6.06235 5.64043L4.81235 6.64043C4.66226 6.7605 4.45664 6.78391 4.28341 6.70065C4.11017 6.61739 4 6.4422 4 6.25V4.25C4 4.0578 4.11017 3.88261 4.28341 3.79935Z" fill="currentColor"/>
    </svg>
  );
}

function UserAddIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.17578 0C2.93314 0 1.92578 1.00736 1.92578 2.25C1.92578 3.49264 2.93314 4.5 4.17578 4.5C5.41842 4.5 6.42578 3.49264 6.42578 2.25C6.42578 1.00736 5.41842 0 4.17578 0Z" fill="currentColor"/>
      <path d="M7.17578 6C7.45192 6 7.67578 6.22386 7.67578 6.5V7.5H8.67578C8.95192 7.5 9.17578 7.72386 9.17578 8C9.17578 8.27614 8.95192 8.5 8.67578 8.5H7.67578V9.5C7.67578 9.77614 7.45192 10 7.17578 10C6.89964 10 6.67578 9.77614 6.67578 9.5V8.5H5.67578C5.39964 8.5 5.17578 8.27614 5.17578 8C5.17578 7.72386 5.39964 7.5 5.67578 7.5H6.67578V6.5C6.67578 6.22386 6.89964 6 7.17578 6Z" fill="currentColor"/>
      <path d="M0.0242348 8.34822C0.452672 6.44183 2.02669 5 4.17629 5C4.89216 5 5.5442 5.15991 6.11134 5.44363C5.84241 5.71473 5.67627 6.08796 5.67627 6.5C4.84784 6.5 4.17627 7.17157 4.17627 8C4.17627 8.82843 4.84784 9.5 5.67627 9.5H0.9755C0.407924 9.5 -0.120653 8.99292 0.0242348 8.34822Z" fill="currentColor"/>
    </svg>
  );
}

function ThumbUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.55904 0.0118772C5.34084 -0.0410324 5.1252 0.0880534 5.03864 0.295224C4.5 2.23792 3 3.26542 3 4.62287V7.85053C3 8.42375 3.33181 8.98816 3.9178 9.20155C5.24322 9.68419 6.11676 9.7824 7.47978 9.66428C8.5252 9.57368 9.31106 8.77216 9.52885 7.8042L9.95122 5.92697C10.2326 4.67657 9.28167 3.48795 8 3.48795L6.5 3.48792C6.73464 2.08008 7.30751 0.435851 5.55904 0.0118772Z" fill="currentColor"/>
      <path d="M0 4.48792C0 4.0737 0.335787 3.73792 0.75 3.73792H1.75C2.16421 3.73792 2.5 4.0737 2.5 4.48792V8.48792C2.5 8.90213 2.16421 9.23792 1.75 9.23792H0.75C0.335787 9.23792 0 8.90213 0 8.48792V4.48792Z" fill="currentColor"/>
    </svg>
  );
}

function DollarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM5 1.75C5.27614 1.75 5.5 1.97386 5.5 2.25V2.56183C5.90202 2.66355 6.25675 2.88729 6.48795 3.20702C6.64975 3.4308 6.59952 3.74337 6.37575 3.90517C6.15198 4.06698 5.83941 4.01675 5.6776 3.79298C5.56897 3.64274 5.32671 3.5 5 3.5H4.86111C4.41372 3.5 4.25 3.77246 4.25 3.88889V3.92705C4.25 4.02568 4.32456 4.19131 4.57627 4.29199L5.79512 4.77953C6.32859 4.99292 6.75 5.4693 6.75 6.07295C6.75 6.80947 6.1615 7.3072 5.5 7.45453V7.75C5.5 8.02614 5.27614 8.25 5 8.25C4.72386 8.25 4.5 8.02614 4.5 7.75V7.43817C4.09798 7.33645 3.74325 7.11271 3.51205 6.79298C3.35025 6.56921 3.40048 6.25663 3.62425 6.09483C3.84802 5.93302 4.1606 5.98325 4.3224 6.20703C4.43103 6.35726 4.67329 6.5 5 6.5H5.09119C5.56492 6.5 5.75 6.21045 5.75 6.07295C5.75 5.97432 5.67544 5.80869 5.42373 5.70801L4.20488 5.22047C3.67141 5.00708 3.25 4.5307 3.25 3.92705V3.88889C3.25 3.15689 3.84468 2.66952 4.5 2.53666V2.25C4.5 1.97386 4.72386 1.75 5 1.75Z" fill="currentColor"/>
    </svg>
  );
}

function MegaphoneSmallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.19674 0.0478081C7.8417 -0.157446 8.5 0.323887 8.5 1.00072V2.37989C9.36261 2.60191 10 3.38496 10 4.31688C10 5.2488 9.36261 6.03185 8.5 6.25388V7.63305C8.5 8.30988 7.8417 8.79122 7.19674 8.58596L5.81965 8.14771C5.50442 8.83703 4.8088 9.31688 4 9.31688C2.89543 9.31688 2 8.42145 2 7.31688V6.92743L0.696048 6.51141C0.28145 6.37913 0 5.99391 0 5.55872V3.07505C0 2.63986 0.28145 2.25464 0.696048 2.12236L2.28791 1.61448C2.31115 1.60351 2.33537 1.59428 2.3604 1.58695L7.19674 0.0478081ZM3 7.25037V7.31688C3 7.86917 3.44772 8.31688 4 8.31688C4.36001 8.31688 4.67642 8.12645 4.85261 7.83995L3 7.25037ZM9 4.31688C9 4.68702 8.7989 5.0102 8.5 5.1831V3.45067C8.7989 3.62357 9 3.94674 9 4.31688ZM2.0011 2.75565V5.87812L1 5.55872V3.07505L2.0011 2.75565Z" fill="currentColor"/>
    </svg>
  );
}

function CrownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.88806 0.296867C7.76441 0.111401 7.55626 0 7.33336 0C7.11045 0 6.9023 0.111401 6.77866 0.296867L4.43844 3.80719L0.964832 2.07038C0.73623 1.95608 0.462404 1.98254 0.259911 2.13849C0.0574187 2.29443 -0.0380915 2.55242 0.014036 2.80264L1.45958 9.74124C1.6528 10.6687 2.47019 11.3333 3.41754 11.3333H11.2492C12.1965 11.3333 13.0139 10.6687 13.2071 9.74124L14.6527 2.80264C14.7048 2.55242 14.6093 2.29443 14.4068 2.13849C14.2043 1.98254 13.9305 1.95608 13.7019 2.07038L10.2283 3.80719L7.88806 0.296867Z" fill="currentColor"/>
    </svg>
  );
}

function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2C10.895 2 10 2.895 10 4H8C6.895 4 6 4.895 6 6V10C6 13.314 8.686 16 12 16C15.314 16 18 13.314 18 10V6C18 4.895 17.105 4 16 4H14C14 2.895 13.105 2 12 2ZM9.5 8C10.328 8 11 8.672 11 9.5C11 10.328 10.328 11 9.5 11C8.672 11 8 10.328 8 9.5C8 8.672 8.672 8 9.5 8ZM14.5 8C15.328 8 16 8.672 16 9.5C16 10.328 15.328 11 14.5 11C13.672 11 13 10.328 13 9.5C13 8.672 13.672 8 14.5 8ZM6 17C4.343 17 3 18.343 3 20V22H21V20C21 18.343 19.657 17 18 17H6Z" fill="url(#robotGrad)"/>
      <defs>
        <linearGradient id="robotGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3FD5"/>
          <stop offset="1" stopColor="#FF9025"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Onboarding Steps ───────────────────────────────────────────────

const STEPS = [
  {
    key: "account",
    title: "Create agency account",
    description: "You're all set!",
    completed: true,
    icon: null,
  },
  {
    key: "profile",
    title: "Complete your agency profile",
    description: "Add logo, description, team members and portfolio",
    completed: false,
    icon: PersonIcon,
    action: "Complete profile",
  },
  {
    key: "brand",
    title: "Add your first brand client",
    description: "Connect a brand to start managing their campaigns",
    completed: false,
    icon: ChainLinkIcon,
    action: "Add clients",
  },
  {
    key: "campaign",
    title: "Launch first campaign",
    description: "Create a CPM, retainer, or per-video campaign for your brand",
    completed: false,
    icon: MegaphoneIcon,
    action: "Launch campaign",
  },
  {
    key: "recruit",
    title: "Recruit creators",
    description: "Upload content and start earning",
    completed: false,
    icon: StarIcon,
    action: "Recruit",
  },
];

// ── Dashboard Data ─────────────────────────────────────────────────

const CAMPAIGNS = [
  { name: "Call of Duty BO7 Clipping", meta: "CPM · 121k views · 31 creators", pct: 45, color: "#00B259" },
  { name: "Caffeine AI Exclusive", meta: "CPM · 121k views · 31 creators", pct: 78, color: "#FF9025" },
  { name: "G Fuel Summer Promo", meta: "CPM · 121k views · 31 creators", pct: 94, color: "#FF2525" },
  { name: "Apex Legends Season 20", meta: "CPM · 121k views · 31 creators", pct: 78, color: "#FF9025" },
  { name: "Fortnite Festival Clips", meta: "CPM · 121k views · 31 creators", pct: 45, color: "#00B259" },
];

function AttentionVideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.6 0.8C1.6 0.358 1.958 0 2.4 0H13.6C14.042 0 14.4 0.358 14.4 0.8C14.4 1.242 14.042 1.6 13.6 1.6H2.4C1.958 1.6 1.6 1.242 1.6 0.8ZM0 4.8C0 3.474 1.074 2.4 2.4 2.4H13.6C14.926 2.4 16 3.474 16 4.8V12C16 13.326 14.926 14.4 13.6 14.4H2.4C1.074 14.4 0 13.326 0 12V4.8ZM6.853 6.079C7.131 5.946 7.46 5.983 7.7 6.175L9.7 7.775C9.89 7.927 10 8.158 10 8.4C10 8.642 9.89 8.873 9.7 9.025L7.7 10.625C7.46 10.817 7.131 10.854 6.853 10.721C6.576 10.588 6.4 10.307 6.4 10V6.8C6.4 6.493 6.576 6.212 6.853 6.079Z" fill="#FF9025"/>
    </svg>
  );
}

function AttentionUserAddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6.68 0C4.69 0 3.08 1.61 3.08 3.6C3.08 5.59 4.69 7.2 6.68 7.2C8.67 7.2 10.28 5.59 10.28 3.6C10.28 1.61 8.67 0 6.68 0Z" fill="#AE4EEE"/>
      <path d="M11.48 9.6C11.92 9.6 12.28 9.96 12.28 10.4V12H13.88C14.32 12 14.68 12.36 14.68 12.8C14.68 13.24 14.32 13.6 13.88 13.6H12.28V15.2C12.28 15.64 11.92 16 11.48 16C11.04 16 10.68 15.64 10.68 15.2V13.6H9.08C8.64 13.6 8.28 13.24 8.28 12.8C8.28 12.36 8.64 12 9.08 12H10.68V10.4C10.68 9.96 11.04 9.6 11.48 9.6Z" fill="#AE4EEE"/>
      <path d="M0.04 13.36C0.72 10.31 3.24 8 6.68 8C7.83 8 8.87 8.26 9.78 8.71C9.35 9.14 9.08 9.74 9.08 10.4C7.76 10.4 6.68 11.47 6.68 12.8C6.68 14.13 7.76 15.2 9.08 15.2H1.56C0.65 15.2 -0.19 14.39 0.04 13.36Z" fill="#AE4EEE"/>
    </svg>
  );
}

function AttentionContractIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M2 0C0.895431 0 0 0.89543 0 2V11.3333C0 12.4379 0.895431 13.3333 2 13.3333H7.44714C7.37344 13.1248 7.33333 12.9004 7.33333 12.6667C6.22876 12.6667 5.33333 11.7712 5.33333 10.6667C5.33333 9.5621 6.22876 8.66667 7.33333 8.66667C7.33333 7.5621 8.22876 6.66667 9.33333 6.66667C9.84557 6.66667 10.3128 6.85924 10.6667 7.17593V2C10.6667 0.895431 9.77124 0 8.66667 0H2Z" fill="#00B259"/>
      <path d="M10 8.66667C10 8.29848 9.70152 8 9.33333 8C8.96514 8 8.66667 8.29848 8.66667 8.66667V10H7.33333C6.96514 10 6.66667 10.2985 6.66667 10.6667C6.66667 11.0349 6.96514 11.3333 7.33333 11.3333H8.66667V12.6667C8.66667 13.0349 8.96514 13.3333 9.33333 13.3333C9.70152 13.3333 10 13.0349 10 12.6667V11.3333H11.3333C11.7015 11.3333 12 11.0349 12 10.6667C12 10.2985 11.7015 10 11.3333 10H10V8.66667Z" fill="#00B259"/>
    </svg>
  );
}

function AttentionWarningIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.95407 0.992259C5.72583 -0.330751 7.63743 -0.330754 8.40919 0.992257L13.0878 9.01275C13.8656 10.3461 12.9038 12.0205 11.3602 12.0205H2.00301C0.459432 12.0205 -0.502312 10.3461 0.275454 9.01275L4.95407 0.992259ZM6.68229 4.02051C7.05048 4.02051 7.34896 4.31898 7.34896 4.68717V6.68717C7.34896 7.05536 7.05048 7.35384 6.68229 7.35384C6.3141 7.35384 6.01562 7.05536 6.01562 6.68717V4.68717C6.01562 4.31898 6.3141 4.02051 6.68229 4.02051ZM5.84896 8.68717C5.84896 8.22694 6.22205 7.85384 6.68229 7.85384C7.14253 7.85384 7.51562 8.22694 7.51562 8.68717C7.51562 9.14741 7.14253 9.52051 6.68229 9.52051C6.22205 9.52051 5.84896 9.14741 5.84896 8.68717Z" fill="#EE4E51"/>
    </svg>
  );
}

const ATTENTION_ITEMS = [
  { icon: AttentionVideoIcon, iconBg: "rgba(255,144,37,0.06)", title: "24 submissions", subtitle: "Awaiting review" },
  { icon: AttentionUserAddIcon, iconBg: "rgba(174,78,238,0.06)", title: "2 applications", subtitle: "Awaiting review" },
  { icon: AttentionContractIcon, iconBg: "rgba(0,178,89,0.04)", title: "1 contract pending", subtitle: "Awaiting review" },
  { icon: AttentionWarningIcon, iconBg: "rgba(238,78,81,0.06)", title: "2 budget warnings", subtitle: "G Fuel critical, Caffeine AI low" },
];

const ACTIVITY_ITEMS = [
  { icon: UserAddIcon, title: "New clipper", subtitle: "Clip_Nova_23 joined", time: "2h ago" },
  { icon: ThumbUpIcon, title: "Clips approved", subtitle: "3 clips from NightOwlEdits", time: "4h ago" },
  { icon: DollarIcon, title: "Earnings credited", subtitle: "+ $42.50 from approved clips", time: "4h ago" },
  { icon: MegaphoneSmallIcon, title: "Campaign joined", subtitle: "Referral joined 'Spring Clips 2026'", time: "8h ago" },
  { icon: UserAddIcon, title: "New clipper", subtitle: "edit_wizard_99 joined", time: "1d ago" },
  { icon: UserAddIcon, title: "New clipper", subtitle: "edit_wizard_99 joined", time: "1d ago" },
];

const TOP_CREATORS = [
  { name: "ClipMaster_Jay", earned: "$4,280" },
  { name: "NightOwlEdits", earned: "$4,280" },
  { name: "Clip_Nova_23", earned: "$4,280" },
];

const PENDING_DRAFTS = [
  { name: "Lila Bennett", campaign: "NFL UGC · Revision 2 uploaded", tag: "V2", tagColor: "#FF9025", bg: "rgba(255,144,37,0.1)" },
  { name: "Marcus Cole", campaign: "Caffeine Exclusive - New draft", tag: "New", tagColor: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
];

// ── Sparkline ──────────────────────────────────────────────────────

let sparklineIdCounter = 0;
function MiniSparkline({ color = "#34D399" }: { color?: string }) {
  const [gradId] = useState(() => `spark-grad-${++sparklineIdCounter}`);
  return (
    <svg width="75" height="21" viewBox="0 0 75 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="37.037" y1="0" x2="37.037" y2="20.3704" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.2"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0.823045 19.7398L0 20.3704L74.0741 16.5286L73.251 13.7963L73.251 13.7962C72.4279 11.0639 70.7819 5.59932 69.1358 2.72906C67.4897 -0.141227 65.8436 -0.417165 64.1975 0.40033C62.5514 1.21783 60.9053 3.12875 59.2593 4.81876C57.6132 6.50877 55.9671 7.97785 54.321 7.99406C52.6749 8.01028 51.0288 6.57362 49.3827 6.5874C47.7366 6.60119 46.0905 8.06542 44.4444 9.54757L44.3656 9.61859C42.7458 11.0774 41.126 12.5361 39.5062 12.9249C37.8601 13.32 36.214 12.61 34.5679 12.7767C32.9218 12.9435 31.2757 13.9868 29.6296 12.4432C27.9835 10.8995 26.3375 6.76874 24.6914 5.1633C23.0453 3.55785 21.3992 4.47771 19.7531 4.50747C18.107 4.53724 16.4609 3.67691 14.8148 2.68805C13.1687 1.69919 11.5226 0.581794 9.87654 2.87689C8.23045 5.17199 6.58436 10.8796 4.93827 14.3639C3.29218 17.8482 1.64609 19.1093 0.823045 19.7398Z" fill={`url(#${gradId})`}/>
      <path d="M0.274902 20.0888L1.09795 19.4813C1.92099 18.8738 3.56708 17.6588 5.21317 14.3019C6.85926 10.9449 8.50535 5.44586 10.1514 3.23464C11.7975 1.02342 13.4436 2.09998 15.0897 3.05271C16.7358 4.00543 18.3819 4.83431 20.028 4.80564C21.6741 4.77696 23.3202 3.89072 24.9663 5.43749C26.6123 6.98426 28.2584 10.964 29.9045 12.4513C31.5506 13.9386 33.1967 12.9333 34.8428 12.7727C36.4889 12.6121 38.135 13.2961 39.7811 12.9154C41.4272 12.5348 43.0733 11.0895 44.7193 9.66154C46.3654 8.23355 48.0115 6.82283 49.6576 6.80955C51.3037 6.79627 52.9498 8.18043 54.5959 8.1648C56.242 8.14918 57.8881 6.73379 59.5342 5.10555C61.1802 3.4773 62.8263 1.63621 64.4724 0.848591C66.1185 0.0609715 67.7646 0.326825 69.4107 3.09222C71.0568 5.85761 72.7029 11.1225 73.5259 13.755L74.349 16.3875" stroke={color} strokeWidth="0.925926"/>
    </svg>
  );
}

// ── Progress bar ───────────────────────────────────────────────────

function BudgetBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1 w-20 rounded-full bg-foreground/10">
        <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-inter text-xs tracking-[-0.02em]" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ── Onboarding Step Row ────────────────────────────────────────────

function OnboardingStepRow({
  step,
  isComplete,
  onToggle,
  isFirst,
  isLast,
  prevComplete,
  nextComplete,
}: {
  step: typeof STEPS[number];
  isComplete: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
  prevComplete: boolean;
  nextComplete: boolean;
}) {
  return (
    <div className="relative flex w-full gap-3">
      {/* Vertical connector line + icon column */}
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        {/* Top connector */}
        {!isFirst && (
          <div className="absolute left-1/2 top-0 h-[calc(50%-20px)] w-px -translate-x-1/2">
            <div
              className="h-full w-full transition-colors duration-500"
              style={{
                background: prevComplete && isComplete
                  ? "linear-gradient(to bottom, #00B36E, #00B36E)"
                  : prevComplete
                    ? "linear-gradient(to bottom, rgba(0,179,110,0.3), rgba(0,0,0,0.06))"
                    : "rgba(0,0,0,0.06)",
              }}
            />
          </div>
        )}
        {/* Bottom connector */}
        {!isLast && (
          <div className="absolute bottom-0 left-1/2 h-[calc(50%-20px)] w-px -translate-x-1/2">
            <div
              className="h-full w-full transition-colors duration-500"
              style={{
                background: isComplete && nextComplete
                  ? "linear-gradient(to bottom, #00B36E, #00B36E)"
                  : isComplete
                    ? "linear-gradient(to bottom, rgba(0,179,110,0.3), rgba(0,0,0,0.06))"
                    : "rgba(0,0,0,0.06)",
              }}
            />
          </div>
        )}
        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center self-center py-3">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="done"
                className="flex size-10 items-center justify-center rounded-full bg-[#00B36E] shadow-[0px_0px_0px_2px_var(--card-bg)]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 20, delay: 0.1 }}
                >
                  <CheckCircleIcon className="size-[17px] text-white" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                className="flex size-10 items-center justify-center rounded-full border border-page-border bg-card-bg shadow-[0px_0px_0px_2px_var(--card-bg)]"
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {step.icon && <step.icon className="size-5 text-page-text-subtle" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 py-3">
        <motion.div
          className="flex flex-1 flex-col justify-center gap-1"
          animate={{
            opacity: isComplete ? 0.45 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <span className="relative w-fit text-sm font-medium tracking-[-0.02em] text-page-text">
            {step.title}
            {/* Strikethrough line animation */}
            <motion.span
              className="absolute left-0 top-1/2 h-px origin-left bg-page-text/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isComplete ? 1 : 0 }}
              style={{ width: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: isComplete ? 0.15 : 0 }}
            />
          </span>
          <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">{step.description}</span>
        </motion.div>
        {step.action && (
          <AnimatePresence>
            {!isComplete && (
              <motion.button
                onClick={onToggle}
                className="cursor-pointer whitespace-nowrap rounded-full bg-[rgba(37,37,37,0.06)] px-4 py-2 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors duration-150 hover:bg-[rgba(37,37,37,0.12)] active:bg-[rgba(37,37,37,0.16)] dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.12)] dark:active:bg-[rgba(255,255,255,0.16)]"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                {step.action}
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Floating Onboarding Checklist ──────────────────────────────────

function FloatingChecklist({
  completed,
  onToggle,
}: {
  completed: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const completedCount = STEPS.filter((s) => s.completed || completed[s.key]).length;
  const progress = completedCount / STEPS.length;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 w-[340px] overflow-hidden rounded-2xl border border-page-border bg-card-bg shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 border-b border-page-border/50 px-4 py-3"
      >
        <div
          className="flex size-8 items-center justify-center rounded-full"
          style={{
            background: "#FF9025",
            boxShadow: "inset 0px 0.5px 2px rgba(0,0,0,0.12)",
          }}
        >
          <StarsLogo className="size-4 text-white" />
        </div>
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">
            Setup checklist
          </span>
          {/* Progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#00B36E]"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">
          {completedCount}/{STEPS.length}
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            <div className="px-2 py-2">
              {STEPS.map((step) => {
                const isComplete = step.completed || completed[step.key];
                return (
                  <button
                    key={step.key}
                    disabled={isComplete || step.completed}
                    onClick={() => !isComplete && step.action && onToggle(step.key)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                      !isComplete && step.action && "cursor-pointer hover:bg-foreground/[0.04]",
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isComplete ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="flex size-5 items-center justify-center rounded-full bg-[#00B36E]"
                        >
                          <CheckCircleIcon className="size-3 text-white" />
                        </motion.div>
                      ) : (
                        <div className="size-5 rounded-full border border-page-border" />
                      )}
                    </AnimatePresence>
                    <span
                      className={cn(
                        "flex-1 text-sm tracking-[-0.02em]",
                        isComplete ? "text-page-text-muted line-through" : "text-page-text",
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Onboarding View ────────────────────────────────────────────────

function OnboardingView({
  completed,
  onToggle,
  onSkip,
}: {
  completed: Record<string, boolean>;
  onToggle: (key: string) => void;
  onSkip: () => void;
}) {
  return (
    <div className="relative flex flex-col items-start gap-2 self-stretch p-4 sm:flex-1 sm:px-8 sm:py-4">
      {/* Radial gradient background with noise to prevent banding */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 blur-[80px] dark:blur-[120px]"
          style={{
            background: [
              "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255, 63, 213, 0.24) 0%, rgba(255, 63, 213, 0) 100%)",
              "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255, 144, 37, 0.24) 0%, rgba(255, 144, 37, 0) 100%)",
            ].join(", "),
          }}
        />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" style={{ mixBlendMode: "overlay" }} aria-hidden>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="relative z-[1] flex flex-col items-center self-stretch rounded-[20px] px-0 py-2 sm:flex-1 sm:py-4">
        <div className="flex w-full max-w-[720px] flex-col items-center sm:flex-1 sm:justify-center">
          {/* Header */}
          <motion.div
            className="flex w-full max-w-[720px] flex-col items-center gap-4 pb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center drop-shadow-[0_-1px_3px_rgba(0,0,0,0.06)]">
              <motion.div
                className="-mr-2 flex size-14 items-center justify-center rounded-full border border-[rgba(37,37,37,0.1)]"
                style={{
                  background: [
                    "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.005) 100%)",
                    "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.32) 0%, rgba(255,63,213,0) 100%)",
                    "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.32) 0%, rgba(255,144,37,0) 100%)",
                    "#FF9025",
                  ].join(", "),
                  boxShadow: "inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 0.972px 0px rgba(255,255,255,0.36)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              >
                <StarsLogo className="size-7 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, x: -8 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
              >
                <WorkspaceAvatar />
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-5">
              <h1 className="text-center text-lg font-medium tracking-[-0.02em] text-page-text sm:text-xl">
                Manage brands, creators and campaigns
              </h1>
              <p className="max-w-[457px] text-center text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle sm:text-base">
                Your agency dashboard lets you run multiple brand campaigns from one place. Add your first brand client to get started.
              </p>
            </div>
          </motion.div>

          {/* Checklist card */}
          <motion.div
            className="flex w-full max-w-[720px] flex-col rounded-2xl border border-page-border bg-card-bg p-4 sm:p-6"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {STEPS.map((step, i) => {
              const isComplete = step.completed || completed[step.key];
              const prevComplete = i === 0 || STEPS[i - 1].completed || completed[STEPS[i - 1].key];
              const nextComplete = i < STEPS.length - 1 && (STEPS[i + 1].completed || completed[STEPS[i + 1].key]);
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.06 }}
                >
                  <OnboardingStepRow
                    step={step}
                    isComplete={isComplete}
                    onToggle={() => onToggle(step.key)}
                    isFirst={i === 0}
                    isLast={i === STEPS.length - 1}
                    prevComplete={prevComplete}
                    nextComplete={nextComplete}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Skip button */}
          <motion.button
            onClick={onSkip}
            className="mt-4 cursor-pointer text-sm tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            I&apos;ll do this later
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard View ─────────────────────────────────────────────────

function DashboardView() {
  const campaignsContainerRef = useRef<HTMLDivElement>(null);
  const campaignHover = useProximityHover(campaignsContainerRef);
  const campaignActiveRect = campaignHover.activeIndex !== null ? campaignHover.itemRects[campaignHover.activeIndex] : null;

  const activityContainerRef = useRef<HTMLDivElement>(null);
  const activityHover = useProximityHover(activityContainerRef);
  const activityActiveRect = activityHover.activeIndex !== null ? activityHover.itemRects[activityHover.activeIndex] : null;

  useEffect(() => { campaignHover.measureItems(); }, [campaignHover.measureItems]);
  useEffect(() => { activityHover.measureItems(); }, [activityHover.measureItems]);

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 pt-4 sm:px-5">
      {/* AI Tip Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card-bg p-4 sm:gap-4">
        <SparkleIcon className="size-4 shrink-0 text-page-text-muted dark:text-white" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-3">
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">
            You&apos;ve spent <span className="font-semibold text-[#FF9025]">78%</span> of your budget in the <span className="font-semibold text-page-text">Caffeine AI</span> campaign, with <span className="font-semibold text-page-text">4 days left.</span>
          </span>
          <RichButton size="sm" className="shrink-0 rounded-full">
            Top up
          </RichButton>
        </div>
        <div className="flex items-center gap-0 opacity-70">
          <ChevronLeftIcon className="size-4 text-page-text" />
          <ChevronRightIcon className="size-4 text-page-text" />
        </div>
      </div>

      {/* KPI Cards Row */}
      {/* KPI Cards Row — subgrid aligns numbers across all 5 cards */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-nowrap">
        {/* Balance card — fixed 320px on lg+, full width on mobile */}
        <div className="flex w-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card-bg p-4 sm:w-[calc(50%-4px)] lg:w-[320px] lg:shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Balance</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex-1 font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$14,200</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">$2,880 unallocated</span>
            </div>
            <div className="flex gap-2">
              <RichButton size="sm" className="flex-1 rounded-full">
                <PlusIcon className="size-3" />
                Deposit
              </RichButton>
              <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                <HistoryIcon className="size-3" />
                History
              </button>
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card-bg p-4 sm:w-[calc(50%-4px)] lg:min-w-0 lg:flex-1">
          <div className="flex items-start justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Active</span>
            <MiniSparkline />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">24</span>
            <div className="flex gap-1">
              <span className="flex h-6 items-center rounded-full bg-[rgba(59,130,246,0.12)] px-2.5 font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#3B82F6]">3 CPM</span>
              <span className="flex h-6 items-center rounded-full bg-[#FFF2E5] px-2.5 font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF9025] dark:bg-[rgba(255,144,37,0.15)]">2 Retainer</span>
            </div>
          </div>
        </div>

        {/* Views */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card-bg p-4 sm:w-[calc(50%-4px)] lg:min-w-0 lg:flex-1">
          <div className="flex items-start justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Views</span>
            <MiniSparkline />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">10</span>
            <span className="w-fit rounded-full bg-[rgba(0,178,89,0.1)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#00B259]">+31% this week</span>
          </div>
        </div>

        {/* Avg CPM */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card-bg p-4 sm:w-[calc(50%-4px)] lg:min-w-0 lg:flex-1">
          <div className="flex items-start justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Avg CPM</span>
            <MiniSparkline />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$0.67</span>
            <span className="w-fit rounded-full bg-[rgba(0,178,89,0.1)] px-2 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#00B259]">-$0.05 (better)</span>
          </div>
        </div>

        {/* Paid Out */}
        <div className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card-bg p-4 sm:w-[calc(50%-4px)] lg:min-w-0 lg:flex-1">
          <div className="flex items-start justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Paid Out</span>
            <MiniSparkline />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">$18.4k</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">$10.7k spend this period</span>
          </div>
        </div>
      </div>

      {/* Active Campaigns + Needs Attention Row */}
      <div className="flex flex-col gap-2 lg:flex-row">
        {/* Active Campaigns Table */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 sm:px-6">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Active Campaigns</span>
            <button className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View All</span>
              <ArrowRightIcon className="size-3 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text" />
            </button>
          </div>
          {/* Rows */}
          <div
            ref={campaignsContainerRef}
            className="relative flex flex-col"
            onMouseEnter={campaignHover.handlers.onMouseEnter}
            onMouseMove={campaignHover.handlers.onMouseMove}
            onMouseLeave={campaignHover.handlers.onMouseLeave}
          >
            <AnimatePresence>
              {campaignActiveRect && (
                <motion.div
                  key={campaignHover.sessionRef.current}
                  className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                  initial={{ opacity: 0, top: campaignActiveRect.top, left: campaignActiveRect.left, width: campaignActiveRect.width, height: campaignActiveRect.height }}
                  animate={{ opacity: 1, top: campaignActiveRect.top, left: campaignActiveRect.left, width: campaignActiveRect.width, height: campaignActiveRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {CAMPAIGNS.map((c, i) => {
              const hideBorder = campaignHover.activeIndex === i || campaignHover.activeIndex === i + 1;
              return (
                <div
                  key={i}
                  ref={(el) => campaignHover.registerItem(i, el)}
                  data-proximity-index={i}
                  className="flex cursor-pointer items-center px-4 transition-colors duration-150 sm:px-6"
                >
                  <div className={cn("flex flex-1 items-center justify-between py-3", i < CAMPAIGNS.length - 1 && "border-b", hideBorder ? "border-transparent" : "border-foreground/[0.03]")}>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="size-8 shrink-0 rounded bg-foreground/[0.06]" />
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                        <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{c.meta}</span>
                      </div>
                    </div>
                    <BudgetBar pct={c.pct} color={c.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:w-[300px] lg:shrink-0">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Needs Attention</span>
          <div className="flex flex-col gap-2">
            {ATTENTION_ITEMS.map((item, i) => (
              <button
                key={i}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white px-3 py-4 text-left transition-colors hover:bg-foreground/[0.02] dark:border-foreground/[0.06] dark:bg-card-bg"
              >
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-full backdrop-blur-[12px]"
                  style={{ background: item.iconBg }}
                >
                  <item.icon />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">{item.title}</span>
                  <span className="truncate font-inter text-xs leading-none tracking-[-0.02em] text-foreground/50">{item.subtitle}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                  <path d="M6 2.667L10 8L6 13.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Weekly Insight */}
      <div
        className="relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-card-bg p-4"
      >
        <div
          className="pointer-events-none absolute inset-0 dark:blur-[40px]"
          style={{
            background: [
              "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255, 63, 213, 0.24) 0%, rgba(255, 63, 213, 0) 100%)",
              "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255, 144, 37, 0.24) 0%, rgba(255, 144, 37, 0) 100%)",
            ].join(", "),
          }}
        />
        <div className="relative flex min-w-0 items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card-bg shadow-[0_0_0_2px_var(--card-bg)]">
            <RobotIcon />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">AI Weekly Insight</span>
            <span className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">
              Your COD BO7 campaign is outperforming by 2.4x - consider increasing budget by $500 to capture momentum. 3 creators are consistently hitting 90%+ approval, ideal candidates for retainer contracts.
            </span>
          </div>
        </div>
        <ChevronRightIcon className="relative size-4 shrink-0 text-page-text opacity-70" />
      </div>

      {/* Bottom Row: Recent Activity + Top Creators + Pending Drafts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Recent activity</span>
            <button className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View All</span>
              <ArrowRightIcon className="size-3 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text" />
            </button>
          </div>
          <div
            ref={activityContainerRef}
            className="relative flex flex-col gap-2"
            onMouseEnter={activityHover.handlers.onMouseEnter}
            onMouseMove={activityHover.handlers.onMouseMove}
            onMouseLeave={activityHover.handlers.onMouseLeave}
          >
            <AnimatePresence>
              {activityActiveRect && (
                <motion.div
                  key={activityHover.sessionRef.current}
                  className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                  initial={{ opacity: 0, top: activityActiveRect.top, left: activityActiveRect.left, width: activityActiveRect.width, height: activityActiveRect.height }}
                  animate={{ opacity: 1, top: activityActiveRect.top, left: activityActiveRect.left, width: activityActiveRect.width, height: activityActiveRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {ACTIVITY_ITEMS.map((item, i) => (
              <div
                key={i}
                ref={(el) => activityHover.registerItem(i, el)}
                data-proximity-index={i}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-150"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <item.icon className="size-3 text-page-text" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{item.title}</span>
                  <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{item.subtitle}</span>
                </div>
                <span className="shrink-0 font-inter text-[10px] tracking-[-0.02em] text-page-text-muted">{item.time}</span>
              </div>
            ))}
          </div>
          {/* Fade out bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35px] bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
        </div>

        {/* Top Creators This Week */}
        <div className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Top creators this week</span>
            <button className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View All</span>
              <ArrowRightIcon className="size-3 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {/* #1 — featured card */}
            <div className="relative flex items-center justify-center gap-3 rounded-2xl border border-border bg-card-bg p-4">
              {/* Badge */}
              <div className="absolute left-4 top-4 flex h-10 items-center gap-2 rounded-full bg-[#FF9025] px-3">
                <CrownIcon className="size-4 text-white" />
                <span className="font-inter text-base font-medium tracking-[-0.02em] text-white">1</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 rounded-full bg-foreground/10" />
                <div className="flex flex-col items-center gap-2">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{TOP_CREATORS[0].name}</span>
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{TOP_CREATORS[0].earned}</span>
                </div>
              </div>
            </div>
            {/* #2 and #3 */}
            <div className="flex gap-2">
              {TOP_CREATORS.slice(1).map((creator, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div className="flex size-10 items-center justify-center rounded-full border" style={{ borderColor: i === 0 ? "#839FB9" : "#9E5200" }}>
                    <span className="font-inter text-base font-medium tracking-[-0.02em]" style={{ color: i === 0 ? "#839FB9" : "#9E5200" }}>{i + 2}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-10 rounded-full bg-foreground/10" />
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{creator.name}</span>
                      <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{creator.earned}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35px] bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
        </div>

        {/* Pending Drafts */}
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Pending drafts</span>
            <button className="group flex cursor-pointer items-center gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View All</span>
              <ArrowRightIcon className="size-3 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {PENDING_DRAFTS.map((draft, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl p-2" style={{ background: draft.bg }}>
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: `${draft.tagColor}10` }}>
                  <VideoIcon className="size-3" style={{ color: draft.tagColor }} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{draft.name}</span>
                  <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{draft.campaign}</span>
                </div>
                <span className="shrink-0 font-inter text-[10px] tracking-[-0.02em]" style={{ color: draft.tagColor }}>{draft.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function Home() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [skipped, setSkipped] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const onToggle = useCallback((key: string) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
  }, []);

  const allDone = STEPS.every((s) => s.completed || completed[s.key]);
  const showOnboarding = !allDone && !skipped;

  // Trigger the reveal animation when all steps complete or user skips
  useEffect(() => {
    if (!showOnboarding && !showDashboard) {
      const timer = setTimeout(() => setShowDashboard(true), 500);
      return () => clearTimeout(timer);
    }
  }, [showOnboarding, showDashboard]);

  // Show floating checklist when skipped (not all done)
  const showFloatingChecklist = skipped && !allDone;

  return (
    <div className={showOnboarding ? "flex min-h-full flex-col" : ""}>
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            className="flex min-h-full flex-1 flex-col"
            exit={{
              opacity: 0,
              scale: 0.97,
              filter: "blur(8px)",
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <OnboardingView
              completed={completed}
              onToggle={onToggle}
              onSkip={() => setSkipped(true)}
            />
          </motion.div>
        ) : showDashboard ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.4 },
            }}
          >
            {/* Top nav header */}
            <motion.div
              className="sticky top-0 z-10 flex h-[56px] items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Home</span>
              <NewCampaignButton />
            </motion.div>
            <DashboardView />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating checklist for skipped users — portaled to body to escape contain:layout */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showFloatingChecklist && (
            <FloatingChecklist completed={completed} onToggle={onToggle} />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

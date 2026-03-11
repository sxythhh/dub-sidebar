"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Drawer as DrawerPrimitive } from "vaul";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

/* ── Wallet Card ─────────────────────────────────────────────────── */

function WalletCard({
  balance = "$299",
  label = "For Nandi",
  plan = "PRO",
  period = "8760H",
  generatedDate = "3/10/2026",
  generatedTime = "8 AM",
}: {
  balance?: string;
  label?: string;
  plan?: string;
  period?: string;
  generatedDate?: string;
  generatedTime?: string;
}) {
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const rotateX = hovering ? (mousePos.y - 0.5) * -8 : 0;
  const rotateY = hovering ? (mousePos.x - 0.5) * 8 : 0;
  const lightX = mousePos.x * 100;
  const lightY = mousePos.y * 100;

  return (
    <div className="w-full max-w-[480px]" style={{ perspective: "800px" }}>
      <motion.div
        className="relative flex aspect-[480/300] w-full max-w-[480px] flex-col items-center overflow-hidden rounded-[20px]"
        style={{
          background: "#131313",
          boxShadow: `
            0px 10px 20px rgba(0, 0, 0, 0.15),
            0px 20px 40px rgba(0, 0, 0, 0.2),
            0px 30px 60px rgba(0, 0, 0, 0.1),
            inset 0.5px 0.5px 0px rgba(255, 255, 255, 0.1),
            inset 4px 4px 15px rgba(255, 255, 255, 0.05)
          `,
        }}
        animate={{
          rotateX,
          rotateY,
          scale: hovering ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setMousePos({ x: 0.5, y: 0.5 });
        }}
        onMouseMove={handleMouseMove}
      >
        {/* ── Top bar: logo + label ── */}
        <div className="z-10 flex w-full items-center justify-between px-5 pt-5">
          {/* Small "O" logo */}
          <svg width="14" height="21" viewBox="0 0 14 21" fill="none">
            <path
              d="M7 0C3.134 0 0 4.701 0 10.5S3.134 21 7 21s7-4.701 7-10.5S10.866 0 7 0Zm0 18.9c-2.485 0-4.5-3.761-4.5-8.4S4.515 2.1 7 2.1s4.5 3.761 4.5 8.4-2.015 8.4-4.5 8.4Z"
              fill="#E8E8E8"
            />
          </svg>
          <span className="font-inter text-[15px] font-medium leading-[18px] text-[#9BA1A5] opacity-80">
            {label}
          </span>
        </div>

        {/* ── Large balance (dark embossed layer with text-shadow shine) ── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="select-none font-inter text-[clamp(48px,18vw,85.7px)] font-semibold leading-[1.2] tracking-[-0.86px]"
            style={{
              color: "#212121",
              textShadow: "-0.5px -0.5px 0px #BDBDBD",
            }}
          >
            {balance}
          </span>
        </div>

        {/* ── Large balance (light gradient shine layer, masked to fade bottom) ── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="select-none font-inter text-[clamp(48px,18vw,85.7px)] font-semibold leading-[1.2] tracking-[-0.86px]"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 30%, #A0A0A0 60%, #505050 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 0.66,
              maskImage: "linear-gradient(180deg, black 24%, transparent 80%)",
              WebkitMaskImage: "linear-gradient(180deg, black 24%, transparent 80%)",
            }}
          >
            {balance}
          </span>
        </div>

        {/* ── Bottom content ── */}
        <div className="z-10 mt-auto flex w-full items-end px-5 pb-2">
          {/* Left */}
          <div className="flex flex-1 flex-col gap-0">
            <span className="font-mono text-xs font-medium leading-4 tracking-[0.36px] text-[#E8E8E8]">
              PLAN / {plan}
            </span>
            <span className="font-mono text-xs font-medium leading-4 tracking-[0.36px] text-[#E8E8E8]">
              PERIOD / {period}
            </span>
          </div>
          {/* Right */}
          <div className="flex flex-1 flex-col items-end gap-0">
            <span className="font-mono text-xs font-medium leading-4 tracking-[0.36px] text-[#E8E8E8]">
              GENERATED
            </span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-medium leading-4 tracking-[0.36px] text-[#E8E8E8]">
                {generatedDate}
              </span>
              <span className="font-mono text-xs font-medium leading-4 tracking-[0.36px] text-[#E8E8E8]">
                {generatedTime}
              </span>
            </div>
          </div>
        </div>

        {/* ── Glass light follow effect ── */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: hovering ? 0.12 : 0,
            background: `radial-gradient(600px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.25), transparent 40%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* ── Ambient light blob (top-left, always visible) ── */}
        <div
          className="pointer-events-none absolute z-20"
          style={{
            width: 380,
            height: 380,
            left: -170,
            top: -243,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(232,232,232,0.8) 0%, transparent 100%)",
            mixBlendMode: "overlay",
            opacity: 0.06,
            filter: "blur(25px)",
          }}
        />
        <div
          className="pointer-events-none absolute z-20"
          style={{
            width: 380,
            height: 380,
            left: -170,
            top: -244,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(232,232,232,0.8) 0%, transparent 100%)",
            mixBlendMode: "overlay",
            opacity: 0.06,
            filter: "blur(15px)",
          }}
        />

        {/* ── Noise texture ── */}
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            mixBlendMode: "overlay",
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ── Folder Icon ─────────────────────────────────────────────────── */

/** Extract dominant color from an image src using canvas sampling */
function useDominantColor(src: string) {
  const [color, setColor] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Weighted average — skip near-white/black/transparent pixels
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const pr = data[i], pg = data[i + 1], pb = data[i + 2], pa = data[i + 3];
        if (pa < 128) continue; // skip transparent
        const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
        if (lum < 20 || lum > 235) continue; // skip near-black/white
        const sat = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);
        const weight = sat > 30 ? 2 : 1; // boost saturated pixels
        r += pr * weight;
        g += pg * weight;
        b += pb * weight;
        count += weight;
      }
      if (count > 0) {
        setColor([Math.round(r / count), Math.round(g / count), Math.round(b / count)]);
      }
    };
    img.src = src;
  }, [src]);

  return color;
}

/** Derive folder palette from an RGB color */
function useFolderPalette(rgb: [number, number, number] | null) {
  return useMemo(() => {
    if (!rgb) {
      // Fallback yellow
      return {
        base: "#F5C542",
        gradTop: "#F7D15B",
        gradMid: "#E8B730",
        gradBot: "#D4A220",
      };
    }
    const [r, g, b] = rgb;
    // Lighten for gradient top
    const lighten = (v: number, amt: number) => Math.min(255, Math.round(v + (255 - v) * amt));
    // Darken for gradient bottom
    const darken = (v: number, amt: number) => Math.round(v * (1 - amt));
    const hex = (rv: number, gv: number, bv: number) =>
      `#${[rv, gv, bv].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

    return {
      base: hex(r, g, b),
      gradTop: hex(lighten(r, 0.25), lighten(g, 0.25), lighten(b, 0.25)),
      gradMid: hex(r, g, b),
      gradBot: hex(darken(r, 0.25), darken(g, 0.25), darken(b, 0.25)),
    };
  }, [rgb]);
}

function FolderIcon({ iconSrc = "/icon-blue.png" }: { iconSrc?: string }) {
  const [hovered, setHovered] = useState(false);
  const dominantColor = useDominantColor(iconSrc);
  const palette = useFolderPalette(dominantColor);

  return (
    <div
      className="relative flex h-[140px] w-[145px] cursor-pointer items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Folder back — skews on hover */}
      <motion.svg
        className="absolute inset-0"
        width="145"
        height="140"
        viewBox="0 0 145 140"
        fill="none"
        style={{ transformOrigin: "center bottom" }}
        animate={{
          transform: hovered
            ? "matrix(1, 0, 0.15, 0.99, 0, 0)"
            : "matrix(1, 0, 0, 1, 0, 0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <defs>
          <linearGradient id="folder-back-border-band" x1="72" y1="10" x2="72" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor={palette.gradMid} />
            <stop offset="1" stopColor={palette.gradBot} />
          </linearGradient>
        </defs>
        {/* Outer shape — gradient border band (darker than front) */}
        <path
          d="M8 20C8 14.477 12.477 10 18 10H50C52.122 10 54.157 10.843 55.657 12.343L60.343 17.029C61.843 18.529 63.878 19.372 66 19.372H127C132.523 19.372 137 23.849 137 29.372V120C137 125.523 132.523 130 127 130H18C12.477 130 8 125.523 8 120V20Z"
          fill="url(#folder-back-border-band)"
        />
        {/* Inner fill — solid, 4px inset */}
        <path
          d="M12 24C12 19.582 15.582 16 20 16H48.5C50.622 16 52.657 16.843 54.157 18.343L58.343 22.529C59.843 24.029 61.878 24.872 64 24.872H125C129.418 24.872 133 28.454 133 32.872V118C133 122.418 129.418 126 125 126H20C15.582 126 12 122.418 12 118V24Z"
          fill={palette.base}
        />
      </motion.svg>

      {/* Paper 1 (back) — rises up and tilts left on hover */}
      <motion.div
        className="absolute rounded-lg border border-black/20 bg-white dark:border-white/10 dark:bg-[#1e1e1e]"
        style={{ width: 94, height: 87, transformOrigin: "center bottom" }}
        animate={
          hovered
            ? { left: 14, top: -19, transform: "matrix(0.99, -0.15, 0.13, 0.99, 0, 0)" }
            : { left: 13, top: 27, transform: "matrix(1, 0, 0, 1, 0, 0)" }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Paper 2 (front) — rises up and tilts right on hover */}
      <motion.div
        className="absolute overflow-hidden rounded-lg border border-black/20 bg-white shadow-[0_-4px_8px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#252525]"
        style={{ transformOrigin: "center bottom" }}
        animate={
          hovered
            ? { width: 93, height: 87, left: 37, top: 2, transform: "matrix(1, 0.08, -0.06, 1, 0, 0)" }
            : { width: 120, height: 100, left: 13, top: 27, transform: "matrix(1, 0, 0, 1, 0, 0)" }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Faux lines */}
        <div className="mt-4 flex flex-col gap-2 px-3">
          <div className="h-1.5 w-16 rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="h-1.5 w-20 rounded-full bg-black/[0.04] dark:bg-white/[0.06]" />
          <div className="h-1.5 w-14 rounded-full bg-black/[0.04] dark:bg-white/[0.05]" />
          <div className="h-1.5 w-10 rounded-full bg-black/[0.03] dark:bg-white/[0.04]" />
        </div>
      </motion.div>

      {/* Folder front */}
      <motion.div
        className="absolute"
        style={{ transformOrigin: "center bottom", width: 145, height: 120 }}
        animate={
          hovered
            ? { left: 4, right: 0, bottom: -1, transform: "matrix(1, 0, -0.08, 0.99, 0, 0)" }
            : { left: 0, right: 0, bottom: 0, transform: "matrix(1, 0, 0, 1, 0, 0)" }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg
          className="absolute inset-0"
          width="145"
          height="120"
          viewBox="0 0 145 120"
          fill="none"
        >
          <defs>
            <linearGradient id="folder-border-band" x1="72" y1="8" x2="72" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor={palette.gradTop} />
              <stop offset="1" stopColor={palette.gradBot} />
            </linearGradient>
          </defs>
          {/* Outer shape — gradient fill (visible as the 4px border band) */}
          <path
            d="M0 18C0 12.477 4.477 8 10 8H135C140.523 8 145 12.477 145 18V110C145 115.523 140.523 120 135 120H10C4.477 120 0 115.523 0 110V18Z"
            fill="url(#folder-border-band)"
          />
          {/* Inner fill — solid, 4px inset */}
          <path
            d="M4 20C4 15.582 7.582 12 12 12H133C137.418 12 141 15.582 141 20V108C141 112.418 137.418 116 133 116H12C7.582 116 4 112.418 4 108V20Z"
            fill={palette.base}
          />
        </svg>

        {/* Icon on front flap */}
        <img
          src={iconSrc}
          alt=""
          className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-[8px]"
        />

      </motion.div>

      {/* Notification badge "1" */}
      <motion.div
        className="absolute right-1 top-1 z-10 flex size-5 items-center justify-center rounded-full bg-[#FF2525]"
        animate={{ scale: hovered ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <span className="font-inter text-[10px] font-bold leading-none text-white">
          1
        </span>
      </motion.div>
    </div>
  );
}

/* ── Payout history data ─────────────────────────────────────────── */

interface PayoutEntry {
  id: string;
  campaign: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "processing";
}

const PAYOUT_ENTRIES: PayoutEntry[] = [
  { id: "1", campaign: "Harry Styles Podcast Clipping", date: "Mar 5, 2026", amount: "$139.75", status: "pending" },
  { id: "2", campaign: "Call of Duty BO7 Campaign", date: "Feb 28, 2026", amount: "$85.20", status: "processing" },
  { id: "3", campaign: "Mumford & Sons Clipping", date: "Feb 18, 2026", amount: "$69.16", status: "paid" },
  { id: "4", campaign: "Harry Styles Podcast Clipping", date: "Feb 10, 2026", amount: "$112.40", status: "paid" },
  { id: "5", campaign: "Call of Duty BO7 Campaign", date: "Jan 31, 2026", amount: "$54.80", status: "paid" },
  { id: "6", campaign: "Mumford & Sons Clipping", date: "Jan 22, 2026", amount: "$92.30", status: "paid" },
];

const STATUS_CONFIG: Record<
  PayoutEntry["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "#FF9025", bg: "rgba(255, 144, 37, 0.1)" },
  processing: { label: "Processing", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  paid: { label: "Paid", color: "#00B26E", bg: "rgba(0, 178, 110, 0.1)" },
};

const STAT_CARDS = [
  { label: "Total earned", value: "$553.61" },
  { label: "Received", value: "$328.66", highlight: true },
  { label: "Pending", value: "$224.95" },
];

/* ── Wallet Drawer ────────────────────────────────────────────────── */

const WALLET_TRANSACTIONS = [
  { label: "CPM payout — Harry Styles", date: "Mar 5", amount: "+$139.75", positive: true },
  { label: "CPM payout — Call of Duty", date: "Feb 28", amount: "+$85.20", positive: true },
  { label: "Withdrawal to bank", date: "Feb 25", amount: "-$200.00", positive: false },
  { label: "CPM payout — Mumford & Sons", date: "Feb 18", amount: "+$69.16", positive: true },
  { label: "CPM payout — Harry Styles", date: "Feb 10", amount: "+$112.40", positive: true },
  { label: "Withdrawal to bank", date: "Feb 5", amount: "-$150.00", positive: false },
  { label: "CPM payout — Call of Duty", date: "Jan 31", amount: "+$54.80", positive: true },
  { label: "CPM payout — Mumford & Sons", date: "Jan 22", amount: "+$92.30", positive: true },
];

function WalletDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [snap, setSnap] = useState<number | string | null>(0.5);
  const scrollRef = useRef<HTMLDivElement>(null);
  const snapCooldown = useRef(false);

  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v) setSnap(0.5);
      onOpenChange(v);
    },
    [onOpenChange],
  );

  const isAtTop = () => {
    const el = scrollRef.current;
    return !el || el.scrollTop <= 0;
  };

  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={[0.5, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0}
      modal
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DrawerPrimitive.Content
          className="wallet-drawer fixed inset-x-0 bottom-0 z-50 mt-6 flex max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-t-[28px] bg-page-bg shadow-2xl outline-none"
          onPointerDownOutside={() => handleOpenChange(false)}
        >
          <style>{`
            [vaul-drawer].wallet-drawer {
              transition: transform 100ms cubic-bezier(0.2, 0, 0, 1) !important;
            }
          `}</style>

          {/* Drag handle */}
          <div className="absolute inset-x-0 top-0 z-10 flex cursor-grab justify-center pt-2.5 active:cursor-grabbing">
            <div className="h-1 w-9 rounded-full bg-black/20 dark:bg-white/30" />
          </div>

          <DrawerPrimitive.Title className="sr-only">
            Wallet Details
          </DrawerPrimitive.Title>

          <div
            ref={scrollRef}
            className="flex-1 scrollbar-hide"
            style={{ overflowY: snap === 1 ? "auto" : "hidden" }}
            onScroll={(e) => {
              if (snap !== 1 && e.currentTarget.scrollTop > 0) setSnap(1);
            }}
            onTouchMove={() => {
              if (snap !== 1) setSnap(1);
            }}
            onWheel={(e) => {
              if (e.deltaY > 0 && snap !== 1) {
                e.preventDefault();
                if (snapCooldown.current) return;
                snapCooldown.current = true;
                setTimeout(() => { snapCooldown.current = false; }, 400);
                setSnap(1);
                return;
              }
              if (e.deltaY < 0 && isAtTop()) {
                if (snapCooldown.current) return;
                e.preventDefault();
                snapCooldown.current = true;
                setTimeout(() => { snapCooldown.current = false; }, 400);
                if (snap === 1) {
                  if (scrollRef.current) scrollRef.current.scrollTop = 0;
                  setSnap(0.5);
                } else {
                  handleOpenChange(false);
                }
              }
            }}
          >
            {/* Balance header */}
            <div className="flex flex-col items-center gap-1 pb-2 pt-8">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Available balance
              </span>
              <span className="font-inter text-[40px] font-semibold leading-[48px] tracking-[-1px] text-page-text">
                $299.00
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 px-5 pb-6 pt-2">
              <button
                type="button"
                className="flex h-10 flex-1 max-w-[200px] cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-background transition-colors hover:opacity-90"
              >
                Withdraw
              </button>
              <button
                type="button"
                className="flex h-10 flex-1 max-w-[200px] cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]"
              >
                Details
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-border" />

            {/* Stats row */}
            <div className="flex items-center gap-2 px-5 py-4">
              {STAT_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border border-card-border bg-card-bg p-3"
                >
                  <span
                    className={cn(
                      "font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]",
                      card.highlight ? "text-[#00B26E]" : "text-page-text",
                    )}
                  >
                    {card.value}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Transaction history */}
            <div className="px-5 pb-2">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Recent transactions
              </span>
            </div>
            <div className="flex flex-col">
              {WALLET_TRANSACTIONS.map((tx, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5",
                    i < WALLET_TRANSACTIONS.length - 1 && "border-b border-foreground/[0.03]",
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-inter text-sm tracking-[-0.02em] text-page-text">
                      {tx.label}
                    </span>
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                      {tx.date}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-inter text-sm font-medium tracking-[-0.02em]",
                      tx.positive ? "text-[#00B26E]" : "text-page-text",
                    )}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function CreatorPayoutsPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const TIME_FILTERS = ["This month", "All Time"];

  const payoutContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex: payoutActiveIndex, itemRects: payoutItemRects, sessionRef: payoutSessionRef, handlers: payoutHandlers, registerItem: payoutRegisterItem, measureItems: payoutMeasureItems } = useProximityHover(payoutContainerRef);
  useEffect(() => { payoutMeasureItems(); }, [payoutMeasureItems]);
  const payoutActiveRect = payoutActiveIndex !== null ? payoutItemRects[payoutActiveIndex] : null;

  return (
    <div className="min-h-full bg-page-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Payouts
        </span>
        <div className="flex items-center gap-0.5 rounded-xl bg-accent p-0.5">
          {TIME_FILTERS.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className={cn(
                "flex h-8 cursor-pointer items-center rounded-[10px] px-4 font-inter text-sm font-medium tracking-[-0.02em] transition-all",
                activeFilter === i
                  ? "bg-card-bg text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                  : "text-page-text-muted hover:text-page-text-subtle",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 p-4 sm:p-6">
        {/* Wallet + Folder row */}
        <div className="flex w-full max-w-[640px] flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="w-full min-w-0 flex-1 cursor-pointer" onClick={() => setWalletOpen(true)}>
            <WalletCard balance="$299" label="For Nandi" />
          </div>
          <div className="shrink-0">
            <FolderIcon />
          </div>
        </div>

        {/* Wallet drawer */}
        <WalletDrawer open={walletOpen} onOpenChange={setWalletOpen} />

        {/* Stats row */}
        <div className="flex w-full max-w-[640px] gap-2">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border border-card-border bg-card-bg p-3"
            >
              <span
                className={cn(
                  "font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]",
                  card.highlight ? "text-[#00B26E]" : "text-page-text",
                )}
              >
                {card.value}
              </span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Payout history table */}
        <div className="w-full overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {/* Header */}
          <div className="flex items-center border-b border-card-border px-4">
            <div className="flex h-10 min-w-0 flex-1 items-center">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Campaign
              </span>
            </div>
            <div className="hidden h-10 w-32 items-center justify-end sm:flex">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Date
              </span>
            </div>
            <div className="flex h-10 w-24 items-center justify-end">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Amount
              </span>
            </div>
            <div className="flex h-10 w-[100px] items-center justify-end">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                Status
              </span>
            </div>
          </div>

          {/* Rows */}
          <div
            ref={payoutContainerRef}
            className="relative"
            onMouseEnter={payoutHandlers.onMouseEnter}
            onMouseMove={payoutHandlers.onMouseMove}
            onMouseLeave={payoutHandlers.onMouseLeave}
          >
            <AnimatePresence>
              {payoutActiveRect && (
                <motion.div
                  key={payoutSessionRef.current}
                  className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                  initial={{ opacity: 0, top: payoutActiveRect.top, left: payoutActiveRect.left, width: payoutActiveRect.width, height: payoutActiveRect.height }}
                  animate={{ opacity: 1, top: payoutActiveRect.top, left: payoutActiveRect.left, width: payoutActiveRect.width, height: payoutActiveRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {PAYOUT_ENTRIES.map((entry, i) => {
              const st = STATUS_CONFIG[entry.status];
              const hideBorder = payoutActiveIndex !== null && (i === payoutActiveIndex || i === payoutActiveIndex - 1);
              return (
                <div
                  key={entry.id}
                  ref={(el) => payoutRegisterItem(i, el)}
                  className={cn(
                    "relative z-10 flex items-center px-4",
                    i < PAYOUT_ENTRIES.length - 1 && cn("border-b transition-[border-color] duration-75", hideBorder ? "border-transparent" : "border-foreground/[0.03]"),
                  )}
                >
                  <div className="flex h-14 min-w-0 flex-1 items-center">
                    <span className="truncate font-inter text-sm tracking-[-0.02em] text-page-text">
                      {entry.campaign}
                    </span>
                  </div>
                  <div className="hidden h-14 w-32 items-center justify-end sm:flex">
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                      {entry.date}
                    </span>
                  </div>
                  <div className="flex h-14 w-24 items-center justify-end">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                      {entry.amount}
                    </span>
                  </div>
                  <div className="flex h-14 w-[100px] items-center justify-end">
                    <div
                      className="flex items-center gap-1 rounded-full py-1.5 pl-2 pr-2.5"
                      style={{ backgroundColor: st.bg }}
                    >
                      <div className="size-1.5 rounded-full" style={{ backgroundColor: st.color }} />
                      <span
                        className="font-inter text-xs font-medium tracking-[-0.02em]"
                        style={{ color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

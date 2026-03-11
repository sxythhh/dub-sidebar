"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function SidebarWalletCard() {
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const rotateX = hovering ? (mousePos.y - 0.5) * -6 : 0;
  const rotateY = hovering ? (mousePos.x - 0.5) * 6 : 0;
  const lightX = mousePos.x * 100;
  const lightY = mousePos.y * 100;

  return (
    <div className="px-3 pb-1">
      <div style={{ perspective: "600px" }}>
        <motion.div
          className="relative flex h-[120px] w-full cursor-pointer flex-col overflow-hidden rounded-[14px]"
          style={{
            background: "#131313",
            boxShadow: `
              0px 6px 12px rgba(0, 0, 0, 0.15),
              0px 12px 24px rgba(0, 0, 0, 0.1),
              inset 0.5px 0.5px 0px rgba(255, 255, 255, 0.1),
              inset 2px 2px 8px rgba(255, 255, 255, 0.04)
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
          {/* Top: logo + label */}
          <div className="z-10 flex w-full items-center justify-between px-3 pt-3">
            <svg width="10" height="15" viewBox="0 0 14 21" fill="none">
              <path
                d="M7 0C3.134 0 0 4.701 0 10.5S3.134 21 7 21s7-4.701 7-10.5S10.866 0 7 0Zm0 18.9c-2.485 0-4.5-3.761-4.5-8.4S4.515 2.1 7 2.1s4.5 3.761 4.5 8.4-2.015 8.4-4.5 8.4Z"
                fill="#E8E8E8"
              />
            </svg>
            <span className="font-inter text-[10px] font-medium leading-[13px] text-[#9BA1A5] opacity-80">
              For Nandi
            </span>
          </div>

          {/* Dark embossed balance */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="select-none font-inter text-[36px] font-semibold leading-[44px] tracking-[-0.4px]"
              style={{
                color: "#212121",
                textShadow: "-0.5px -0.5px 0px #BDBDBD",
              }}
            >
              $299
            </span>
          </div>

          {/* Light gradient shine layer */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="select-none font-inter text-[36px] font-semibold leading-[44px] tracking-[-0.4px]"
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
              $299
            </span>
          </div>

          {/* Bottom: mono details */}
          <div className="z-10 mt-auto flex w-full items-end justify-between px-3 pb-2">
            <span className="font-mono text-[9px] font-medium leading-[12px] tracking-[0.3px] text-[#E8E8E8]">
              PRO
            </span>
            <span className="font-mono text-[9px] font-medium leading-[12px] tracking-[0.3px] text-[#E8E8E8]">
              3/10/2026
            </span>
          </div>

          {/* Glass light follow */}
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: hovering ? 0.12 : 0,
              background: `radial-gradient(300px circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.25), transparent 40%)`,
              mixBlendMode: "overlay",
            }}
          />

          {/* Ambient light blob */}
          <div
            className="pointer-events-none absolute z-20"
            style={{
              width: 200,
              height: 200,
              left: -80,
              top: -120,
              background: "radial-gradient(50% 50% at 50% 50%, rgba(232,232,232,0.8) 0%, transparent 100%)",
              mixBlendMode: "overlay",
              opacity: 0.06,
              filter: "blur(15px)",
            }}
          />

          {/* Noise texture */}
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
    </div>
  );
}

"use client";

import { useState, useRef, useCallback } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { VerifiedAgencyPage } from "./VerifiedAgencyPage";

export function VerifiedAgencyDrawer({
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
          className="agency-drawer fixed inset-x-0 bottom-0 z-50 mt-6 flex max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-t-[28px] bg-page-bg shadow-2xl outline-none"
          onPointerDownOutside={() => handleOpenChange(false)}
        >
          <style>{`
            [vaul-drawer].agency-drawer {
              transition: transform 100ms cubic-bezier(0.2, 0, 0, 1) !important;
            }
            [vaul-overlay] {
              transition: opacity 100ms ease !important;
            }
          `}</style>
          {/* Floating handle - overlaps content */}
          <div className="absolute inset-x-0 top-0 z-10 flex cursor-grab justify-center pt-2.5 active:cursor-grabbing">
            <div className="h-1 w-9 rounded-full bg-black/20 dark:bg-white/30" />
          </div>
          <DrawerPrimitive.Title className="sr-only">
            Verified Agency
          </DrawerPrimitive.Title>
          <div
            ref={scrollRef}
            className="flex-1 scrollbar-hide"
            style={{
              overflowY: snap === 1 ? "auto" : "hidden",
            }}
            onScroll={(e) => {
              if (snap !== 1 && e.currentTarget.scrollTop > 0) {
                setSnap(1);
              }
            }}
            onTouchMove={() => {
              if (snap !== 1) setSnap(1);
            }}
            onWheel={(e) => {
              // Scroll down → expand first, then allow content scroll after cooldown
              if (e.deltaY > 0 && snap !== 1) {
                e.preventDefault();
                if (snapCooldown.current) return;
                snapCooldown.current = true;
                setTimeout(() => { snapCooldown.current = false; }, 400);
                setSnap(1);
                return;
              }
              // Scroll up at top → step down snap or dismiss
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
            <VerifiedAgencyPage />
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

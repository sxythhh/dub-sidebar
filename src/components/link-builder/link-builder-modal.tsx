"use client";

import { useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconX,
  IconChevronDown,
  IconQrcode,
  IconCopy,
  IconExternalLink,
  IconCalendarFilled,
  IconLockFilled,
  IconDeviceMobileFilled,
  IconWorld,
  IconAB2,
  IconTagFilled,
  IconFolderFilled,
  IconArrowRight,
  IconPhotoFilled,
} from "@tabler/icons-react";

// ── Toggle Section ──────────────────────────────────────────────────

function ToggleSection({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
}: {
  icon: typeof IconTagFilled;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-border transition-colors hover:bg-accent">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <span className="flex items-center gap-2.5">
          <Icon size={16} className="text-muted-foreground" strokeWidth={1.5} />
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-foreground">
            {label}
          </span>
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconChevronDown size={14} className="text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Domain Select ───────────────────────────────────────────────────

function DomainSelect() {
  return (
    <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground transition-colors hover:border-border">
      <IconWorld size={14} className="text-muted-foreground" />
      dub.sh
      <IconChevronDown size={12} className="ml-1 text-muted-foreground" />
    </button>
  );
}

// ── Tag Pill ────────────────────────────────────────────────────────

function TagPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em]"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

// ── Main Modal ──────────────────────────────────────────────────────

export function LinkBuilderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [destination, setDestination] = useState("");
  const [slug, setSlug] = useState("");
  const [comments, setComments] = useState("");

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-background/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]"
          >
            <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-popover shadow-2xl ring-1 ring-border">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <span className="font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-foreground">
                  Create link
                </span>
                <button
                  onClick={onClose}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <IconX size={14} strokeWidth={2} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="scrollbar-hide max-h-[60vh] overflow-y-auto">
                {/* Destination URL */}
                <div className="px-5 pt-4 pb-3">
                  <label className="mb-1.5 block font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-muted-foreground">
                    Destination URL
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-accent">
                    <IconExternalLink size={16} className="shrink-0 text-muted-foreground" />
                    <input
                      type="url"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="https://example.com/long-url"
                      className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Short link */}
                <div className="px-5 pb-4">
                  <label className="mb-1.5 block font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-muted-foreground">
                    Short link
                  </label>
                  <div className="flex items-center gap-2">
                    <DomainSelect />
                    <span className="text-muted-foreground">/</span>
                    <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-accent">
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="(auto-generated)"
                        className="flex-1 bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      <button className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
                        <IconCopy size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social preview */}
                <ToggleSection icon={IconPhotoFilled} label="Social preview" defaultOpen>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="flex h-[140px] items-center justify-center bg-accent">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <IconPhotoFilled size={24} strokeWidth={1.5} />
                        <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em]">
                          Enter a URL to generate a preview
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-border px-3 py-2.5">
                      <input
                        type="text"
                        placeholder="OG Title"
                        className="w-full bg-transparent font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="OG Description"
                        className="mt-1 w-full bg-transparent font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </ToggleSection>

                {/* UTM Builder */}
                <ToggleSection icon={IconTagFilled} label="UTM builder">
                  <div className="grid grid-cols-2 gap-3">
                    {["Source", "Medium", "Campaign", "Term", "Content"].map((param) => (
                      <div key={param} className={param === "Campaign" ? "col-span-2" : ""}>
                        <label className="mb-1 block font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground">
                          utm_{param.toLowerCase()}
                        </label>
                        <input
                          type="text"
                          placeholder={param}
                          className="h-8 w-full rounded-md border border-border bg-background px-2.5 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                        />
                      </div>
                    ))}
                  </div>
                </ToggleSection>

                {/* QR Code */}
                <ToggleSection icon={IconQrcode} label="QR code">
                  <div className="flex items-center gap-4">
                    <div className="flex size-24 items-center justify-center rounded-lg bg-accent">
                      <IconQrcode size={48} className="text-muted-foreground" strokeWidth={1} />
                    </div>
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-muted-foreground">
                        A QR code will be generated once you create the link.
                      </p>
                    </div>
                  </div>
                </ToggleSection>

                {/* Targeting */}
                <ToggleSection icon={IconDeviceMobileFilled} label="Targeting">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between rounded-lg bg-accent px-3 py-2.5">
                      <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground">
                        Geo targeting
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground">
                        No rules
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-accent px-3 py-2.5">
                      <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground">
                        Device targeting
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground">
                        No rules
                      </span>
                    </div>
                  </div>
                </ToggleSection>

                {/* Expiration */}
                <ToggleSection icon={IconCalendarFilled} label="Expiration">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="No expiration date"
                      className="h-9 flex-1 rounded-lg border border-border bg-background px-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                    />
                  </div>
                </ToggleSection>

                {/* Password */}
                <ToggleSection icon={IconLockFilled} label="Password protection">
                  <input
                    type="password"
                    placeholder="Enter a password"
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                  />
                </ToggleSection>

                {/* A/B Testing */}
                <ToggleSection icon={IconAB2} label="A/B testing">
                  <div className="flex flex-col gap-3">
                    <p className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground">
                      Split traffic between multiple destinations to find what converts best.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div className="h-2 w-1/2 rounded-full bg-foreground" />
                      </div>
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-foreground">
                        50/50
                      </span>
                    </div>
                  </div>
                </ToggleSection>

                {/* Tags & folder */}
                <div className="border-t border-border px-5 py-3">
                  <div className="flex items-center gap-2">
                    <IconFolderFilled size={14} className="text-muted-foreground" />
                    <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-muted-foreground">
                      No folder
                    </span>
                    <span className="mx-1 text-muted-foreground">·</span>
                    <div className="flex items-center gap-1.5">
                      <TagPill label="Marketing" color="#3B82F6" />
                      <TagPill label="Launch" color="#F59E0B" />
                      <button className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-muted-foreground transition-colors hover:text-foreground">
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="border-t border-border px-5 py-3">
                  <input
                    type="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments..."
                    className="w-full bg-transparent font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <button className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-muted-foreground transition-colors hover:bg-muted">
                    Save as draft
                  </button>
                </div>
                <button className="flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-background transition-colors hover:bg-foreground/90">
                  Create link
                  <IconArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Linkedin,
  Mail,
  MessageCircle,
  Search,
} from "lucide-react";
import AgencyDirectoryIcon from "@/assets/icons/agency-directory.svg";
import LockIcon from "@/assets/icons/lock-closed.svg";
import CursorHandIcon from "@/assets/icons/cursor-hand.svg";

// ── Color tokens (CSS variable references for dark mode support) ─────────────
const C = {
  bg: "var(--card-bg)",
  textPrimary: "var(--page-text)",
  textSecondary: "var(--page-text-subtle)",
  textMuted: "var(--page-text-muted)",
  surface: "var(--page-bg)",
  border: "var(--page-border)",
  blue: "#1F69FF",
};

// ── Agency logo placeholder ──────────────────────────────────────────────────
function AgencyLogo({
  name,
  bg,
  size = 72,
  radius = 16,
  fontSize = 20,
}: {
  name: string;
  bg: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}) {
  const initials = name
    .split(/[\s+&]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "-0.5px",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

// ── Verified badge SVG ───────────────────────────────────────────────────────
function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"
        fill={C.blue}
      />
      <path
        d="M6.5 10.8L4 8.3l1-1 1.5 1.5L10 5.3l1 1-4.5 4.5z"
        fill="#fff"
      />
    </svg>
  );
}

// ── Agency card illustration (hero right side) ───────────────────────────────
function AgencyCardIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: 328,
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating agency logos - left */}
      <div
        style={{
          position: "absolute",
          left: -12,
          bottom: 121,
          display: "flex",
          gap: 12,
        }}
      >
        <AgencyLogo name="Ogilvy" bg="#B8A898" />
        <AgencyLogo name="Huge" bg="#1a1a2e" />
      </div>

      {/* Floating agency logos - right */}
      <div
        style={{
          position: "absolute",
          right: -12,
          bottom: 121,
          display: "flex",
          gap: 12,
        }}
      >
        <AgencyLogo name="Wieden Kennedy" bg="#0f4c3a" />
        <AgencyLogo name="Droga5" bg="#2d1b4e" />
      </div>

      {/* Center card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 2,
          transform: "translateX(-50%)",
          width: 280,
          background: "var(--card-bg)",
          borderRadius: "18px 18px 0 0",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 40px 40px -24px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 12px 12px -8px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
          padding: "6px 6px 4px",
        }}
      >
        {/* Card header */}
        <div
          style={{
            backgroundColor: C.surface,
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 19,
          }}
        >
          {/* Agency info row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <AgencyLogo name="Soar" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" size={52} radius={6} fontSize={18} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 13.2,
                  fontWeight: 100,
                  letterSpacing: "-0.066px",
                  color: "#C0C7D1",
                }}
              >
                agency
              </span>
            </div>
          </div>

          {/* Name + verified */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 15.8,
                fontWeight: 600,
                letterSpacing: "-0.087px",
                lineHeight: "22px",
                color: C.textSecondary,
              }}
            >
              Soar with Us
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 4,
              }}
            >
              <VerifiedBadge />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: C.textSecondary,
                }}
              >
                Verified Agency
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "6px 0 0" }}>
          {/* Visit Website - full width */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 34,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              margin: "0 6px",
            }}
          >
            <Globe
              size={19}
              color={C.textSecondary}
              strokeWidth={1.5}
              style={{ opacity: 0.68 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "20px",
                color: C.textPrimary,
              }}
            >
              Visit Website
            </span>
          </div>

          {/* Contact + LinkedIn row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              margin: "10px 6px 6px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 34,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              <Mail
                size={19}
                color={C.textSecondary}
                strokeWidth={1.5}
                style={{ opacity: 0.68 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textSecondary,
                }}
              >
                Contact
              </span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 34,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              <Linkedin
                size={19}
                color={C.textSecondary}
                strokeWidth={1.5}
                style={{ opacity: 0.68 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textSecondary,
                }}
              >
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature card illustrations ───────────────────────────────────────────────
function BrowserCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White inset card */}
      <div
        style={{
          position: "absolute",
          right: 1,
          bottom: 1,
          width: "calc(100% - 20px)",
          height: 80,
          backgroundColor: "var(--card-bg)",
          borderRadius: "8px 0 0 0",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
        }}
      />

      {/* Traffic light dots */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          display: "flex",
          gap: 3,
        }}
      >
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#FF5E57" }}
        />
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#FFB700" }}
        />
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#00CC1A" }}
        />
      </div>

      {/* URL bar */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 30,
          right: 4,
          height: 32,
          backgroundColor: C.surface,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          padding: "6px 0 6px 6px",
          gap: 6,
        }}
      >
        <Search size={20} color="#A4ACB9" strokeWidth={1.33} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: C.textMuted,
          }}
        >
          https://foreplay.co/agencies/your-agency
        </span>
      </div>

      {/* Verified badge floating */}
      <svg
        width={42}
        height={42}
        viewBox="0 0 16 16"
        fill="none"
        style={{
          position: "absolute",
          right: 80,
          top: 15,
          transform: "rotate(15deg)",
        }}
      >
        <path
          d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"
          fill={C.blue}
        />
        <path
          d="M6.5 10.8L4 8.3l1-1 1.5 1.5L10 5.3l1 1-4.5 4.5z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

function BadgeCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark badge widget - rotated 6deg */}
      <div
        style={{
          position: "absolute",
          left: 16.65,
          top: 22.09,
          display: "flex",
          alignItems: "center",
          padding: "2.71px 7.22px 2.71px 2.71px",
          gap: 8.12,
          width: 168.06,
          height: 51.45,
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08)), #060710",
          borderRadius: 12,
          transform: "rotate(6deg)",
        }}
      >
        {/* Logo container */}
        <div
          style={{
            width: 46.02,
            height: 46.03,
            borderRadius: 9,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AgencyLogo name="Foreplay" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" size={32} radius={6} fontSize={13} />
        </div>

        {/* Text area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "2.71px 4.51px 2.71px 0",
            gap: 2.62,
            minWidth: 103.99,
          }}
        >
          <span
            style={{
              fontSize: 13.2,
              fontWeight: 100,
              letterSpacing: "-0.066px",
              lineHeight: "13.54px",
              color: "#C0C7D1",
            }}
          >
            foreplay
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3.61,
              marginTop: 0.9,
            }}
          >
            <VerifiedBadge size={14.44} />
            <span
              style={{
                fontSize: 10.8,
                fontWeight: 300,
                lineHeight: "14px",
                color: "#FFFFFF",
              }}
            >
              Verified Agency
            </span>
          </div>
        </div>
      </div>

      {/* Gray lock button */}
      <div
        style={{
          position: "absolute",
          left: 201,
          top: "50%",
          transform: "translateY(-50%)",
          width: 140,
          height: 52,
          backgroundColor: C.border,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockIcon width={20} height={20} style={{ color: C.textMuted }} />
      </div>

      {/* Cursor hand icon */}
      <CursorHandIcon
        width={24}
        height={24}
        style={{
          position: "absolute",
          left: 159,
          top: 28,
        }}
      />
    </div>
  );
}

function NewsletterCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White content area */}
      <div
        style={{
          position: "absolute",
          left: 17,
          top: 17,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--card-bg)",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
        }}
      />
      {/* Badge pill */}
      <div
        style={{
          position: "absolute",
          left: 23,
          top: 25,
          backgroundColor: C.surface,
          borderRadius: 24,
          padding: "4px 6px",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: C.textSecondary,
          }}
        >
          300K+ People
        </span>
      </div>
      {/* Placeholder lines */}
      <div
        style={{
          position: "absolute",
          left: 23,
          top: 58,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 180,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 140,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 160,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

// ── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    question: "Is searching for an agency free?",
    answer:
      "Yes, feel free to browse the agency directory here. When you find one you like submit the contact form and we will connect you.",
  },
  {
    question: "How can I list my agency?",
    answer:
      "Access to the agency directory is included on the Agency Plan. If you're on another plan you can reach out directly to see if you qualify.",
  },
  {
    question: 'What are "Verified Agencies"?',
    answer:
      "Verified agencies are vetted by our team to ensure they meet our quality standards. Often they have been given a referral by Foreplay already and successfully serviced the referral.",
  },
  {
    question: "What are the benefits of being listed?",
    answer:
      "Foreplay is used by over 20,000 marketers from DTC brands to B2B GTM teams. Being listed in the directory gives you exposure to these marketers along with being featured in our newsletter of over 300,000 marketers.",
  },
];

// ── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: C.textSecondary,
            textAlign: "left",
          }}
        >
          {question}
        </span>
        {isOpen ? (
          <ChevronUp size={20} color={C.textSecondary} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={20} color={C.textSecondary} strokeWidth={1.5} />
        )}
      </button>
      {isOpen && (
        <div style={{ paddingBottom: 20, paddingRight: 80 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "20px",
              color: C.textMuted,
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  illustration,
  title,
  description,
}: {
  illustration: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column" }}>
      {illustration}
      <div style={{ marginTop: 20 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: C.textSecondary,
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ marginTop: 4 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: C.textMuted,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function VerifiedAgencyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "var(--page-bg)",
        minHeight: "100%",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1104 }}>
        {/* ── Hero section ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {/* Left column */}
          <div
            style={{
              flex: "1 1 480px",
              minWidth: 320,
              padding: 28,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <AgencyDirectoryIcon width={20} height={20} style={{ color: C.textMuted }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textMuted,
                }}
              >
                Agency Directory
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginTop: 12, maxWidth: 420 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  lineHeight: "36px",
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Expand your reach and get inbound leads for your agency.
              </h1>
            </div>

            {/* Subtitle */}
            <div style={{ marginTop: 0, maxWidth: 440 }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "24px",
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Set up your agency profile and get matched with business owners
                and executives looking to hire expert help for their marketing
                projects.
              </p>
            </div>

            {/* Upgrade notice */}
            <div style={{ marginTop: 56 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 6,
                  backgroundColor: C.surface,
                  borderRadius: 6,
                }}
              >
                <LockIcon width={20} height={20} style={{ color: C.textSecondary }} />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "20px",
                    color: C.textSecondary,
                  }}
                >
                  You need to upgrade your plan to Agency.
                </span>
              </div>
            </div>
          </div>

          {/* Right column - illustration */}
          <div
            style={{
              flex: "1 1 480px",
              minWidth: 320,
            }}
          >
            <AgencyCardIllustration />
          </div>
        </div>

        {/* ── Features section ── */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 44,
              padding: 28,
            }}
          >
            <FeatureCard
              illustration={<BrowserCard />}
              title="Verified Branded Profile"
              description="Set up your page in under 15 minutes to drive website traffic from over 500k monthly visitors."
            />
            <FeatureCard
              illustration={<BadgeCard />}
              title="Agency Badge"
              description='Get your "Foreplay Agency" badge to embed on your website.'
            />
            <FeatureCard
              illustration={<NewsletterCard />}
              title="Newsletter Features"
              description="Submit case studies and agency wins to be featured in the Foreplay newsletter (300k subs)"
            />
          </div>
        </div>

        {/* ── FAQ section ── */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              padding: "0 28px",
            }}
          >
            {/* Left column */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: C.textSecondary,
                  margin: 0,
                }}
              >
                FAQ
              </h2>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: C.textMuted,
                  margin: "4px 0 0",
                }}
              >
                Questions about the agency directory.
              </p>

              {/* Contact Support button */}
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    boxShadow:
                      "0px 1px 2px rgba(4,26,75,0.13), 0px 0px 0px 1px rgba(0,56,108,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <MessageCircle
                    size={20}
                    color={C.textMuted}
                    strokeWidth={1.5}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: C.textSecondary,
                    }}
                  >
                    Contact Support
                  </span>
                </button>
              </div>
            </div>

            {/* Right column - FAQ accordion */}
            <div style={{ flex: 1, minWidth: 320 }}>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

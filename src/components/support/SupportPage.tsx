"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Search } from "lucide-react";
import SearchArrows from "@/assets/icons/search-arrows.svg";
import SearchPlay from "@/assets/icons/search-play.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  categories,
  type DocPage,
  type DocCategory,
  type DocSection,
} from "@/lib/support/docs-data";
import { SupportChat } from "./SupportChat";

// ── Theme (ported from auth-standalone) ──────────────────────────────────────

const C = {
  pageBg: "#0a0a0a",
  sidebarBg: "#0a0a0a",
  surfaceBg: "#141413",
  elevatedBg: "#1a1a1a",
  hoverBg: "#222222",
  border: "#1a1a1b",
  textPrimary: "#ffffff",
  textSecondary: "#969696",
  textMuted: "#696969",
  textFaint: "#545454",
  searchBg: "#0f0f0f",
  dropdownBg: "#0e0e0e",
  dropdownHover: "#181818",
  sidebarIconBg: "#1a1a1a",
  accent: "#ff6207",
} as const;

// ── DocMarkdown ──────────────────────────────────────────────────────────────

function DocMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p
            className="text-[15px] font-medium leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <span className="font-bold" style={{ color: C.textPrimary }}>
            {children}
          </span>
        ),
        a: ({ href, children }) => (
          <a
            href={href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline decoration-[#ff6207] hover:text-[#ff6207] transition-colors duration-150"
            style={{ color: C.textPrimary }}
          >
            {children}
          </a>
        ),
        ol: ({ children }) => (
          <ol
            className="list-decimal pl-5 space-y-2 text-[15px] font-medium leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: C.textSecondary }}>
            {children}
          </ul>
        ),
        li: ({ children }) => <li>{children}</li>,
        table: ({ children }) => (
          <div
            className="overflow-x-auto mt-4 mb-4 rounded-lg border"
            style={{ borderColor: C.border }}
          >
            <table className="w-full text-[14px] border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ backgroundColor: C.surfaceBg }}>{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b last:border-b-0" style={{ borderColor: C.border }}>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th
            className="text-left px-4 py-3 font-semibold border-r last:border-r-0"
            style={{ color: C.textPrimary, borderColor: C.border }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            className="px-4 py-3 border-r last:border-r-0"
            style={{ color: C.textSecondary, borderColor: C.border }}
          >
            {children}
          </td>
        ),
        pre: ({ children }) => (
          <pre
            className="mt-4 mb-4 p-4 rounded-lg overflow-x-auto text-[13px] leading-[1.6]"
            style={{ backgroundColor: C.surfaceBg, color: C.textPrimary }}
          >
            {children}
          </pre>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded text-[13px] font-mono"
                style={{ backgroundColor: C.surfaceBg, color: C.textPrimary }}
              >
                {children}
              </code>
            );
          }
          return <code className="font-mono">{children}</code>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectPage,
  isAiMode,
  setIsAiMode,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: DocPage[];
  onSelectPage: (page: DocPage) => void;
  isAiMode: boolean;
  setIsAiMode: (fn: (v: boolean) => boolean) => void;
}) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);

  const showDropdown = focused && searchResults.length > 0;

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", maxWidth: 450 }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
    >
      <div
        ref={barRef}
        onMouseEnter={(e) => {
          if (!showDropdown) e.currentTarget.style.backgroundColor = "#141414";
        }}
        onMouseLeave={(e) => {
          if (!showDropdown) e.currentTarget.style.backgroundColor = "#1a1a1a";
        }}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 52,
          padding: 3,
          backgroundColor: "#1a1a1a",
          borderRadius: showDropdown ? "10px 10px 0 0" : 10,
          boxSizing: "border-box",
          transition: "background-color 0.15s ease, border-radius 0.15s ease",
        }}
      >
        <button
          ref={arrowRef}
          type="button"
          onClick={() => {
            setIsAiMode((v) => !v);
            const el = arrowRef.current;
            if (el) {
              el.style.transform = "scale(0.85)";
              requestAnimationFrame(() => {
                setTimeout(() => {
                  el.style.transform = "scale(1)";
                }, 120);
              });
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 46,
            flexShrink: 0,
            backgroundColor: "#242222",
            backgroundImage: "none",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <SearchArrows width={10} height={17} className="text-[#B6B6B6]" />
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (barRef.current) barRef.current.style.backgroundColor = "#1a1a1a";
          }}
          onFocus={() => setFocused(true)}
          placeholder={isAiMode ? "Ask AI..." : "Search docs..."}
          className="support-search-input"
          style={{
            flex: 1,
            minWidth: 0,
            height: 46,
            padding: "0 8px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.28px",
            color: "#E3E4E8",
          }}
        />

        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            backgroundColor: "#F7890F",
            backgroundImage: "none",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          <SearchPlay width={16} height={18} className="text-white" />
        </button>
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            backgroundColor: "#1a1a1a",
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {searchResults.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => {
                onSelectPage(page);
                setFocused(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e1e1e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                backgroundColor: "transparent",
                backgroundImage: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.1s ease",
              }}
            >
              <Search style={{ width: 14, height: 14, color: "#756B6B", flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#E3E4E8",
                    letterSpacing: "-0.28px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {page.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#756B6B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 1,
                  }}
                >
                  {page.subtitle}
                </div>
              </div>
              <ChevronRight style={{ width: 12, height: 12, color: "#756B6B", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  categories: cats,
  activePage,
  onSelectPage,
}: {
  categories: DocCategory[];
  activePage: DocPage | null;
  onSelectPage: (page: DocPage) => void;
}) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    cats.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  return (
    <div
      className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto"
      style={{
        width: 260,
        borderRight: `1px solid ${C.border}`,
        backgroundColor: C.sidebarBg,
      }}
    >
      <div className="flex-1 px-5 pt-6 pb-4">
        <div className="space-y-4">
          {cats
            .filter((cat) => cat.pages.length > 0)
            .map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategories((prev) => ({
                        ...prev,
                        [cat.id]: !prev[cat.id],
                      }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                    }}
                  >
                    <svg
                      className={`transition-transform duration-200 ${
                        openCategories[cat.id] ? "rotate-90" : ""
                      }`}
                      width={12}
                      height={12}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={C.textMuted}
                      strokeWidth="1.5"
                    >
                      <path d="M4.5 2.5l4 3.5-4 3.5" />
                    </svg>
                  </button>
                  <span
                    className="text-[14px] font-semibold"
                    style={{
                      letterSpacing: "-0.48px",
                      lineHeight: "20px",
                      color: C.textPrimary,
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
                {openCategories[cat.id] && (
                  <div className="ml-[6px] pl-[12px] relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{ backgroundColor: C.border }}
                    />
                    {cat.pages.map((page) => {
                      const isActive = activePage?.id === page.id;
                      return (
                        <div key={page.id} className="relative">
                          {isActive && (
                            <div
                              className="absolute left-[-12px] top-[2px] bottom-[2px] w-px"
                              style={{ backgroundColor: C.accent }}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectPage(page)}
                            className="block w-full text-left text-[14px] font-medium py-[5px] px-2 -mx-1 rounded-[6px] transition-colors duration-150"
                            style={{
                              letterSpacing: "-0.42px",
                              lineHeight: "20px",
                              color: isActive ? C.textPrimary : C.textMuted,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                e.currentTarget.style.color = C.textPrimary;
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                e.currentTarget.style.color = C.textMuted;
                            }}
                          >
                            {page.title}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Article View ─────────────────────────────────────────────────────────────

function ArticleView({
  page,
  onBack,
  allPages,
  onNavigate,
}: {
  page: DocPage;
  onBack: () => void;
  allPages: DocPage[];
  onNavigate: (page: DocPage) => void;
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    page.sections[0]?.id ?? null
  );
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const pageIndex = allPages.findIndex((p) => p.id === page.id);
  const prevPage = pageIndex > 0 ? allPages[pageIndex - 1] : null;
  const nextPage = pageIndex < allPages.length - 1 ? allPages[pageIndex + 1] : null;

  // Scroll spy
  useEffect(() => {
    setActiveSectionId(page.sections[0]?.id ?? null);
    sectionRefs.current.clear();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveSectionId(id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: [0, 0.1] }
    );

    const timeout = setTimeout(() => {
      sectionRefs.current.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [page]);

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = sectionRefs.current.get(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categoryName =
    categories.find((c) => c.pages.some((p) => p.id === page.id))?.name ?? "Docs";

  return (
    <div style={{ display: "flex", minWidth: 0 }}>
      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, padding: "24px 16px" }} className="sm:py-8 sm:px-10 xl:max-w-[820px]">
        {/* Back link */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-semibold hover:underline"
          style={{
            color: C.accent,
            letterSpacing: "-0.56px",
            lineHeight: "14px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7.5 9.5L4 6l3.5-3.5" />
          </svg>
          Return to {categoryName}
        </button>

        {/* Title */}
        <h2
          className="text-[22px] sm:text-[26px] font-bold mt-2"
          style={{ letterSpacing: "-1.04px", lineHeight: "1.4", color: C.textPrimary }}
        >
          {page.title}
        </h2>
        <p
          className="text-[14px] sm:text-[15px] font-medium mt-3"
          style={{ letterSpacing: "-0.3px", lineHeight: "22.5px", color: C.textSecondary }}
        >
          {page.subtitle}
        </p>

        {/* Intro */}
        {page.intro.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-[14px] sm:text-[15px] font-medium leading-[25px] sm:leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {paragraph}
          </p>
        ))}

        {/* Sections */}
        {page.sections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
            data-section-id={section.id}
            className="scroll-mt-[80px]"
          >
            <h3
              className="text-[20px] sm:text-[26px] font-bold mt-8 sm:mt-10"
              style={{ letterSpacing: "-1.04px", lineHeight: "1.4", color: C.textPrimary }}
            >
              {section.heading}
            </h3>
            <DocMarkdown content={section.content} />
          </div>
        ))}

        {/* Prev / Next */}
        <div className="flex gap-4 mt-12 mb-4">
          {prevPage ? (
            <button
              type="button"
              onClick={() => onNavigate(prevPage)}
              className="flex-1 text-left rounded-[12px] border px-5 py-4 transition-colors duration-150"
              style={{
                borderColor: C.border,
                background: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.surfaceBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="text-[14px] font-medium"
                style={{ color: C.textPrimary, letterSpacing: "-0.3px" }}
              >
                {prevPage.title}
              </div>
              <div
                className="text-[13px] font-medium mt-1 flex items-center gap-1"
                style={{ color: C.textMuted, letterSpacing: "-0.3px" }}
              >
                <span>‹</span> Previous
              </div>
            </button>
          ) : (
            <div className="flex-1" />
          )}
          {nextPage ? (
            <button
              type="button"
              onClick={() => onNavigate(nextPage)}
              className="flex-1 text-right rounded-[12px] border px-5 py-4 transition-colors duration-150"
              style={{
                borderColor: C.border,
                background: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.surfaceBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="text-[14px] font-medium"
                style={{ color: C.textPrimary, letterSpacing: "-0.3px" }}
              >
                {nextPage.title}
              </div>
              <div
                className="text-[13px] font-medium mt-1 flex items-center gap-1 justify-end"
                style={{ color: C.textMuted, letterSpacing: "-0.3px" }}
              >
                Next <span>›</span>
              </div>
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </main>

      {/* Right TOC */}
      <aside
        className="support-right-toc"
        style={{
          width: 300,
          flexShrink: 0,
          padding: 32,
          position: "sticky",
          top: 60,
          height: "calc(100vh - 60px)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={C.textPrimary}
            strokeWidth="1.5"
          >
            <path d="M2 4h12M2 8h9M2 12h12" />
          </svg>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.42px",
              color: C.textPrimary,
              margin: 0,
            }}
          >
            On this page
          </p>
        </div>
        {page.sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                padding: "6px 0 6px 16px",
                letterSpacing: "-0.42px",
                color: isActive ? C.textPrimary : C.textSecondary,
                borderLeft: `2px solid ${isActive ? C.accent : C.border}`,
                background: "none",
                backgroundImage: "none",
                border: "none",
                borderLeftWidth: 2,
                borderLeftStyle: "solid",
                borderLeftColor: isActive ? C.accent : C.border,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.textPrimary;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = C.textSecondary;
              }}
            >
              {section.heading}
            </button>
          );
        })}
      </aside>
    </div>
  );
}

// ── Landing View ─────────────────────────────────────────────────────────────

function LandingView({
  pages,
  onSelectPage,
}: {
  pages: DocPage[];
  onSelectPage: (page: DocPage) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? pages : pages.slice(0, 6);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-10 max-w-[900px]">
      <div
        className="p-6 rounded-xl border"
        style={{ borderColor: C.border }}
      >
        <h2
          className="text-[18px] font-semibold"
          style={{ letterSpacing: "-0.5px", color: C.textPrimary }}
        >
          {showAll ? "All articles" : "Recommended articles"}
        </h2>
        <p className="text-[14px] font-medium mt-1 mb-4" style={{ color: C.textMuted }}>
          {showAll
            ? `${pages.length} articles available`
            : "Explore suggested articles to get started"}
        </p>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {displayed.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page)}
              className="group flex items-center gap-4 w-full text-left py-4"
              style={{ borderColor: C.border, background: "none", border: "none", cursor: "pointer" }}
            >
              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={C.textMuted}>
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <span
                className="flex-1 text-[15px] font-medium group-hover:underline"
                style={{ letterSpacing: "-0.4px", color: C.textPrimary }}
              >
                {page.title}
              </span>
              <svg
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke={C.textMuted}
                strokeWidth="1.5"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>
          ))}
        </div>
        {pages.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 mt-4 text-[14px] font-medium"
            style={{ color: C.accent, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-200 ${showAll ? "rotate-90" : ""}`}
            >
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
            {showAll ? "Show less" : "View all articles"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function SupportPageClient() {
  const [selectedPage, setSelectedPage] = useState<DocPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);

  const allPages = useMemo(() => categories.flatMap((c) => c.pages), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.sections.some(
            (s) =>
              s.heading.toLowerCase().includes(q) ||
              s.content.toLowerCase().includes(q)
          )
      )
      .slice(0, 5);
  }, [searchQuery, allPages]);

  return (
    <div
      className="min-h-screen font-inter antialiased flex"
      style={{ backgroundColor: C.pageBg }}
    >
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activePage={selectedPage}
        onSelectPage={(page) => {
          setSelectedPage(page);
          setSearchQuery("");
        }}
      />

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {/* Header with search */}
        {!selectedPage && (
          <div className="py-12 sm:py-16 px-4 sm:px-10 max-w-[900px]">
            <h1
              className="text-[32px] sm:text-[48px] font-medium"
              style={{
                letterSpacing: "-0.02em",
                lineHeight: "50px",
                color: C.textPrimary,
              }}
            >
              Help Center
            </h1>
            <p
              className="text-[16px] font-normal max-w-[420px] mt-3"
              style={{
                letterSpacing: "-0.01em",
                lineHeight: "25px",
                color: C.textMuted,
              }}
            >
              Browse documentation, search for answers, or chat with our AI assistant.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                onSelectPage={(page) => {
                  setSelectedPage(page);
                  setSearchQuery("");
                }}
                isAiMode={isAiMode}
                setIsAiMode={setIsAiMode}
              />

              {/* Category pills */}
              {!searchQuery && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: "-0.42px",
                      color: "#E3E4E8",
                    }}
                  >
                    Discover
                  </span>
                  {categories
                    .filter((c) => c.pages.length > 0)
                    .map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          // Navigate to first page in category
                          if (cat.pages[0]) {
                            setSelectedPage(cat.pages[0]);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(38, 38, 38, 0.32)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(38, 38, 38, 0.12)";
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 500,
                          letterSpacing: "-0.24px",
                          color: "#F2F2F2",
                          backgroundColor: "rgba(38, 38, 38, 0.12)",
                          backgroundImage: "none",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        <Search style={{ width: 13, height: 13 }} />
                        {cat.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {selectedPage ? (
          <ArticleView
            page={selectedPage}
            onBack={() => setSelectedPage(null)}
            allPages={allPages}
            onNavigate={(page) => {
              setSelectedPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <LandingView pages={allPages} onSelectPage={(p) => setSelectedPage(p)} />
        )}
      </div>

      {/* AI Chat widget */}
      <SupportChat />

      {/* Global hover styles */}
      <style>{`
        ::selection {
          background-color: rgba(255, 120, 16, 0.9);
          color: #fff;
        }
      `}</style>
    </div>
  );
}

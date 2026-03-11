"use client";

import { useState, type SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { LineChart, BarChart, Sparkline, ChartLegend } from "@/components/ui/chart";
import type { ChartSeries, ChartDataPoint } from "@/components/ui/chart";
import { FilterSelect, type Filter, type ActiveFilter } from "@/components/ui/dub-filter";
import { Globe, Tag, Calendar, Users } from "lucide-react";

// ── Icons ────────────────────────────────────────────────────────────

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2.667 4.667h10.666M6 4.667V3.333a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.334M12 4.667l-.533 8a1.333 1.333 0 0 1-1.334 1.266H5.867a1.333 1.333 0 0 1-1.334-1.266L4 4.667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13.05 10.13a1.1 1.1 0 0 0 .22 1.213l.04.04a1.334 1.334 0 1 1-1.887 1.887l-.04-.04a1.1 1.1 0 0 0-1.213-.22 1.1 1.1 0 0 0-.667 1.007v.113a1.333 1.333 0 0 1-2.667 0v-.06A1.1 1.1 0 0 0 6.117 13.05a1.1 1.1 0 0 0-1.213.22l-.04.04a1.334 1.334 0 1 1-1.887-1.887l.04-.04a1.1 1.1 0 0 0 .22-1.213 1.1 1.1 0 0 0-1.007-.667H2.117a1.333 1.333 0 0 1 0-2.667h.06A1.1 1.1 0 0 0 3.197 6.117a1.1 1.1 0 0 0-.22-1.213l-.04-.04a1.334 1.334 0 1 1 1.887-1.887l.04.04a1.1 1.1 0 0 0 1.213.22h.053a1.1 1.1 0 0 0 .667-1.007v-.113a1.333 1.333 0 0 1 2.667 0v.06a1.1 1.1 0 0 0 .667 1.007 1.1 1.1 0 0 0 1.213-.22l.04-.04a1.334 1.334 0 1 1 1.887 1.887l-.04.04a1.1 1.1 0 0 0-.22 1.213v.053a1.1 1.1 0 0 0 1.007.667h.113a1.333 1.333 0 0 1 0 2.667h-.06a1.1 1.1 0 0 0-1.007.667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.333l2.06 4.174 4.607.673-3.334 3.247.787 4.586L8 11.847l-4.12 2.166.787-4.586L1.333 6.18l4.607-.673L8 1.333Z" fill="currentColor" />
    </svg>
  );
}

// ── Mock chart data ──────────────────────────────────────────────────

const LINE_SERIES: ChartSeries[] = [
  { key: "views", label: "Views", color: "#3B82F6" },
  { key: "engagement", label: "Engagement", color: "#00B259", axis: "right" },
];

const LINE_DATA: ChartDataPoint[] = [
  { label: "Mon", views: 1200, engagement: 4.2 },
  { label: "Tue", views: 1800, engagement: 5.1 },
  { label: "Wed", views: 2400, engagement: 3.8 },
  { label: "Thu", views: 2100, engagement: 6.2 },
  { label: "Fri", views: 3200, engagement: 7.1 },
  { label: "Sat", views: 2800, engagement: 5.5 },
  { label: "Sun", views: 3600, engagement: 8.3 },
];

const BAR_SERIES: ChartSeries[] = [
  { key: "tiktok", label: "TikTok", color: "#FF2D55" },
  { key: "youtube", label: "YouTube", color: "#FF0000" },
  { key: "instagram", label: "Instagram", color: "#E1306C" },
];

const BAR_DATA: ChartDataPoint[] = [
  { label: "Week 1", tiktok: 12, youtube: 5, instagram: 8 },
  { label: "Week 2", tiktok: 18, youtube: 8, instagram: 12 },
  { label: "Week 3", tiktok: 15, youtube: 10, instagram: 14 },
  { label: "Week 4", tiktok: 22, youtube: 12, instagram: 16 },
  { label: "Week 5", tiktok: 28, youtube: 15, instagram: 20 },
  { label: "Week 6", tiktok: 24, youtube: 18, instagram: 22 },
];

// ── Page ─────────────────────────────────────────────────────────────

export default function KitchenSinkPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg">("md");
  const [containedTab, setContainedTab] = useState(0);
  const [underlineTab, setUnderlineTab] = useState(0);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [visibleLineKeys, setVisibleLineKeys] = useState(["views", "engagement"]);
  const [visibleBarKeys, setVisibleBarKeys] = useState(["tiktok", "youtube", "instagram"]);
  const [dubActiveFilters, setDubActiveFilters] = useState<ActiveFilter[]>([]);

  const dubFilters: Filter[] = [
    {
      key: "domain",
      icon: <Globe className="size-4" />,
      label: "Domain",
      options: [
        { value: "dub.sh", label: "dub.sh" },
        { value: "chatg.pt", label: "chatg.pt" },
        { value: "amzn.id", label: "amzn.id" },
        { value: "spti.fi", label: "spti.fi" },
      ],
    },
    {
      key: "tag",
      icon: <Tag className="size-4" />,
      label: "Tag",
      multiple: true,
      options: [
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "product", label: "Product" },
        { value: "engineering", label: "Engineering" },
        { value: "design", label: "Design" },
      ],
      separatorAfter: true,
    },
    {
      key: "date",
      icon: <Calendar className="size-4" />,
      label: "Date",
      options: [
        { value: "today", label: "Today" },
        { value: "yesterday", label: "Yesterday" },
        { value: "last7", label: "Last 7 days" },
        { value: "last30", label: "Last 30 days" },
        { value: "last90", label: "Last 90 days" },
      ],
    },
    {
      key: "user",
      icon: <Users className="size-4" />,
      label: "User",
      options: [
        { value: "alice", label: "Alice Johnson" },
        { value: "bob", label: "Bob Smith" },
        { value: "charlie", label: "Charlie Brown" },
      ],
    },
  ];

  const handleDubFilterSelect = (key: string, value: string | string[]) => {
    setDubActiveFilters((prev) => {
      const existing = prev.find((f) => f.key === key);
      const values = Array.isArray(value) ? value : [value];
      if (existing) {
        return prev.map((f) =>
          f.key === key ? { ...f, values: [...new Set([...f.values, ...values])] } : f,
        );
      }
      return [...prev, { key, values }];
    });
  };

  const handleDubFilterRemove = (key: string, value: string) => {
    setDubActiveFilters((prev) => {
      const updated = prev
        .map((f) =>
          f.key === key ? { ...f, values: f.values.filter((v) => v !== value) } : f,
        )
        .filter((f) => f.values.length > 0);
      return updated;
    });
  };

  const handleLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  const toggleKey = (keys: string[], key: string) =>
    keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key];

  return (
    <div className="flex flex-col gap-12 p-6 sm:p-10">
      <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
        Kitchen Sink
      </h1>

      {/* ── Buttons ────────────────────────────────────────────── */}
      <Section title="Buttons">
        {/* Variants */}
        <Label>Variants</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        {/* Sizes */}
        <Label>Sizes</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        {/* With icons */}
        <Label>With Icons</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button leadingIcon={<PlusIcon />}>Create Campaign</Button>
          <Button variant="secondary" leadingIcon={<SearchIcon />}>Search</Button>
          <Button variant="outline" trailingIcon={<ChevronDownIcon />}>Options</Button>
          <Button variant="destructive" leadingIcon={<TrashIcon />}>Delete</Button>
        </div>

        {/* Icon-only */}
        <Label>Icon Only</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button iconOnly size="xs" variant="ghost"><SettingsIcon /></Button>
          <Button iconOnly size="sm" variant="ghost"><SettingsIcon /></Button>
          <Button iconOnly size="md" variant="secondary"><PlusIcon /></Button>
          <Button iconOnly size="lg" variant="outline"><SearchIcon /></Button>
        </div>

        {/* States */}
        <Label>States</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button loading={loadingBtn} onClick={handleLoading}>
            {loadingBtn ? "Saving..." : "Click to Load"}
          </Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </div>

        {/* All variants × outline/secondary with icons */}
        <Label>Rounded Pill</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-full" leadingIcon={<PlusIcon />}>New</Button>
          <Button className="rounded-full" variant="secondary" leadingIcon={<StarIcon />}>Favorite</Button>
          <Button className="rounded-full" variant="outline" trailingIcon={<ChevronDownIcon />}>Filter</Button>
        </div>
      </Section>

      {/* ── Dropdowns ────────────────────────────────────────── */}
      <Section title="Dropdowns">
        <Label>Multi-filter with custom trigger (Button)</Label>
        <div className="flex flex-wrap items-start gap-4">
          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <Button variant="outline" trailingIcon={<ChevronDownIcon />}>
              All Filters
            </Button>
          </FilterSelect>

          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <Button variant="secondary" trailingIcon={<ChevronDownIcon />}>
              Options
            </Button>
          </FilterSelect>

          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <Button variant="ghost" size="sm">
              <SettingsIcon /> Configure
            </Button>
          </FilterSelect>
        </div>

        <Label>Minimal trigger (no label, no chevron)</Label>
        <div className="flex flex-wrap items-start gap-4">
          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <Button iconOnly variant="outline" size="sm">
              <PlusIcon />
            </Button>
          </FilterSelect>

          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <Button iconOnly variant="ghost" size="sm">
              <SettingsIcon />
            </Button>
          </FilterSelect>

          <FilterSelect
            filters={dubFilters}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
          >
            <span className="cursor-pointer font-inter text-sm text-page-text-muted underline decoration-dotted underline-offset-4 hover:text-page-text">
              Inline link trigger
            </span>
          </FilterSelect>
        </div>

        <Label>Single-filter shortcut (skips category level)</Label>
        <div className="flex flex-wrap items-start gap-4">
          <FilterSelect
            filters={[dubFilters[0]]}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
            searchPlaceholder="Search domains..."
          >
            <Button variant="outline" size="sm" trailingIcon={<ChevronDownIcon />}>
              Domain
            </Button>
          </FilterSelect>

          <FilterSelect
            filters={[dubFilters[1]]}
            activeFilters={dubActiveFilters}
            onSelect={handleDubFilterSelect}
            onRemove={handleDubFilterRemove}
            searchPlaceholder="Search tags..."
          >
            <Button variant="outline" size="sm" trailingIcon={<ChevronDownIcon />}>
              Tags (multi)
            </Button>
          </FilterSelect>
        </div>

        {dubActiveFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {dubActiveFilters.flatMap((f) =>
              f.values.map((v) => (
                <span
                  key={`${f.key}-${v}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-foreground/[0.03] px-2.5 py-1 font-inter text-xs text-page-text"
                >
                  {f.key}: {v}
                  <button
                    type="button"
                    className="cursor-pointer text-page-text-muted hover:text-page-text"
                    onClick={() => handleDubFilterRemove(f.key, v)}
                  >
                    ×
                  </button>
                </span>
              )),
            )}
            <button
              type="button"
              className="cursor-pointer font-inter text-xs text-page-text-muted hover:text-page-text"
              onClick={() => setDubActiveFilters([])}
            >
              Clear all
            </button>
          </div>
        )}
      </Section>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <Section title="Modal">
        <div className="flex flex-wrap items-center gap-3">
          {(["sm", "md", "lg"] as const).map((s) => (
            <Button
              key={s}
              variant="outline"
              onClick={() => {
                setModalSize(s);
                setModalOpen(true);
              }}
            >
              Open {s.toUpperCase()}
            </Button>
          ))}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size={modalSize}>
          <ModalHeader>
            <h2 className="font-inter text-base font-semibold tracking-[-0.02em] text-page-text">
              Modal — {modalSize.toUpperCase()}
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="font-inter text-sm leading-relaxed text-page-text-muted">
              This is a {modalSize} modal with body scroll lock, focus trap, and spring animation.
              Try pressing Tab to cycle focus, or Escape to close.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Focus trap test — Tab here"
                className="h-9 rounded-lg border border-border bg-card-bg px-3 font-inter text-sm text-page-text outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Another input"
                className="h-9 rounded-lg border border-border bg-card-bg px-3 font-inter text-sm text-page-text outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </Section>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <Section title="Tabs">
        <Label>Contained (Pill)</Label>
        <Tabs selectedIndex={containedTab} onSelect={setContainedTab} variant="contained">
          <TabItem label="Overview" index={0} />
          <TabItem label="Analytics" index={1} />
          <TabItem label="Settings" index={2} />
          <TabItem label="Payouts" index={3} count={3} />
        </Tabs>
        <TabContent index={containedTab} labels={["Overview content", "Analytics content", "Settings content", "Payouts content — 3 pending"]} />

        <Label>Underline</Label>
        <Tabs selectedIndex={underlineTab} onSelect={setUnderlineTab} variant="underline">
          <TabItem label="All" index={0} count={42} />
          <TabItem label="Active" index={1} count={18} />
          <TabItem label="Paused" index={2} count={7} />
          <TabItem label="Completed" index={3} count={17} />
        </Tabs>
        <TabContent index={underlineTab} labels={["All campaigns shown", "Active campaigns only", "Paused campaigns only", "Completed campaigns only"]} />

        <Label>Underline with Icons</Label>
        <Tabs selectedIndex={0} onSelect={() => {}} variant="underline">
          <TabItem label="Performance" index={0} icon={<StarIcon />} />
          <TabItem label="Creators" index={1} icon={<SearchIcon />} />
          <TabItem label="Posts" index={2} icon={<SettingsIcon />} />
        </Tabs>
      </Section>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <Section title="Charts">
        <Label>Line Chart</Label>
        <div className="rounded-2xl border border-border bg-card-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-inter text-sm font-medium text-page-text">Performance</span>
            <ChartLegend
              series={LINE_SERIES}
              visibleKeys={visibleLineKeys}
              onToggle={(k) => setVisibleLineKeys((prev) => toggleKey(prev, k))}
            />
          </div>
          <LineChart
            data={LINE_DATA}
            series={LINE_SERIES}
            visibleKeys={visibleLineKeys}
            formatValue={(v, key) => key === "engagement" ? `${v}%` : v.toLocaleString()}
          />
        </div>

        <Label>Bar Chart (Stacked)</Label>
        <div className="rounded-2xl border border-border bg-card-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-inter text-sm font-medium text-page-text">Posts by Platform</span>
            <ChartLegend
              series={BAR_SERIES}
              visibleKeys={visibleBarKeys}
              onToggle={(k) => setVisibleBarKeys((prev) => toggleKey(prev, k))}
            />
          </div>
          <BarChart
            data={BAR_DATA}
            series={BAR_SERIES}
            visibleKeys={visibleBarKeys}
            stacked
          />
        </div>

        <Label>Sparklines</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-card-bg p-3">
            <span className="font-inter text-xs text-page-text-muted">Views</span>
            <div className="flex items-center gap-3">
              <span className="font-inter text-lg font-semibold text-page-text">12.4k</span>
              <Sparkline color="#3B82F6" />
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-card-bg p-3">
            <span className="font-inter text-xs text-page-text-muted">Revenue</span>
            <div className="flex items-center gap-3">
              <span className="font-inter text-lg font-semibold text-page-text">$4.2k</span>
              <Sparkline color="#00B259" />
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-card-bg p-3">
            <span className="font-inter text-xs text-page-text-muted">CPM</span>
            <div className="flex items-center gap-3">
              <span className="font-inter text-lg font-semibold text-page-text">$0.67</span>
              <Sparkline color="#FF9025" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-inter text-lg font-semibold tracking-[-0.02em] text-page-text">{title}</h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 font-inter text-xs font-medium uppercase tracking-[0.06em] text-page-text-muted">
      {children}
    </p>
  );
}

function TabContent({ index, labels }: { index: number; labels: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card-bg px-4 py-3">
      <p className="font-inter text-sm text-page-text-muted">{labels[index]}</p>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/react";

function GlassCardTest() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 40 }}>
      <h2 style={{ color: "var(--af-text)", margin: 0 }}>Glass Card Test</h2>

      {/* Test 1: Just the class */}
      <div className="af-glass-card" style={{ padding: 20 }}>
        <span style={{ color: "var(--af-text)" }}>af-glass-card class only</span>
      </div>

      {/* Test 2: Class with other Tailwind classes (same as StatsCards) */}
      <div
        className="flex flex-col justify-center flex-1 min-w-0 af-glass-card"
        style={{ gap: 12, padding: 16 }}
      >
        <span style={{ color: "var(--af-text)" }}>With Tailwind classes (like StatsCards)</span>
      </div>

      {/* Test 3: Inline background for comparison */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <span style={{ color: "var(--af-text)" }}>Inline rgba(255,255,255,0.12) for comparison</span>
      </div>
    </div>
  );
}

const meta: Meta = {
  component: GlassCardTest,
  parameters: {
    layout: "padded",
  },
  title: "Affiliate/GlassCard Debug",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};

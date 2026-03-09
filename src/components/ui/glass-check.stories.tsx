import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { GlassCheckGroup, GlassCheckItem } from "./glass-check";

const meta = {
  component: GlassCheckGroup,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/Check",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [checks, setChecks] = useState<Record<string, boolean>>({
      production: false,
      terms: true,
    });
    return (
      <GlassCheckGroup>
        <GlassCheckItem
          checked={checks.terms}
          description="By checking this box, you agree to the Terms of Service"
          label="I have read and agree to the Campaign Terms"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, terms: v }))}
        />
        <GlassCheckItem
          checked={checks.production}
          label="I can consistently produce 4 videos a month"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, production: v }))}
        />
      </GlassCheckGroup>
    );
  },
};

export const AllChecked: Story = {
  render: function Render() {
    const [checks, setChecks] = useState({ a: true, b: true });
    return (
      <GlassCheckGroup>
        <GlassCheckItem
          checked={checks.a}
          description="With a description"
          label="First option"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, a: v }))}
        />
        <GlassCheckItem
          checked={checks.b}
          label="Second option"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, b: v }))}
        />
      </GlassCheckGroup>
    );
  },
};

export const AllUnchecked: Story = {
  render: function Render() {
    const [checks, setChecks] = useState({ a: false, b: false });
    return (
      <GlassCheckGroup>
        <GlassCheckItem
          checked={checks.a}
          description="With a description"
          label="First option"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, a: v }))}
        />
        <GlassCheckItem
          checked={checks.b}
          label="Second option"
          onCheckedChange={(v) => setChecks((p) => ({ ...p, b: v }))}
        />
      </GlassCheckGroup>
    );
  },
};

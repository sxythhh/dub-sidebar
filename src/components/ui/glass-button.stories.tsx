import type { Meta, StoryObj } from "@storybook/react";
import { CircleCheck, Plus, Trash2 } from "lucide-react";

import {
  GlassActionButton,
  GlassAddButton,
  GlassIconButton,
  GlassPrimaryButton,
  GlassSecondaryButton,
} from "./glass-button";

const meta = {
  component: GlassPrimaryButton,
  parameters: { layout: "centered" },
  title: "Glass/Button",
} satisfies Meta<typeof GlassPrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Primary: Story = {
  args: { children: "Continue" },
};

export const PrimaryDisabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const Secondary: RenderStory = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <GlassSecondaryButton>Save as draft</GlassSecondaryButton>
      <GlassSecondaryButton>Cancel</GlassSecondaryButton>
    </div>
  ),
};

export const IconButtons: RenderStory = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
      <GlassIconButton>
        <Trash2 size={16} />
      </GlassIconButton>
      <GlassIconButton size={36}>
        <Trash2 size={14} />
      </GlassIconButton>
    </div>
  ),
};

export const AddButton: RenderStory = {
  render: () => (
    <div style={{ width: 300 }}>
      <GlassAddButton
        icon={<Plus className="text-glass-text-secondary" size={16} />}
      >
        Add requirement
      </GlassAddButton>
    </div>
  ),
};

export const ActionButtons: RenderStory = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <GlassActionButton>Reject</GlassActionButton>
      <GlassActionButton icon={<CircleCheck size={16} strokeWidth={1.5} />}>
        Accept
      </GlassActionButton>
    </div>
  ),
};

export const AllVariants: RenderStory = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <GlassPrimaryButton>Continue</GlassPrimaryButton>
        <GlassPrimaryButton disabled>Disabled</GlassPrimaryButton>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <GlassSecondaryButton>Save as draft</GlassSecondaryButton>
        <GlassSecondaryButton>Cancel</GlassSecondaryButton>
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <GlassIconButton>
          <Trash2 size={16} />
        </GlassIconButton>
        <GlassIconButton size={36}>
          <Trash2 size={14} />
        </GlassIconButton>
      </div>
      <div style={{ width: 300 }}>
        <GlassAddButton
          icon={<Plus className="text-glass-text-secondary" size={16} />}
        >
          Add requirement
        </GlassAddButton>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <GlassActionButton>Reject</GlassActionButton>
        <GlassActionButton icon={<CircleCheck size={16} strokeWidth={1.5} />}>
          Accept
        </GlassActionButton>
      </div>
    </div>
  ),
};

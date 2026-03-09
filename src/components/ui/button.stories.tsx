import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Plus } from "lucide-react";

import { Button } from "./button";

const meta = {
  component: Button,
  parameters: { layout: "centered" },
  title: "UI/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: Story = {
  args: { children: "Button" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Link: Story = {
  args: { children: "Link", variant: "link" },
};

export const WithIcon: RenderStory = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button>
        <Mail data-icon="inline-start" />
        Login with Email
      </Button>
      <Button variant="outline">
        <Plus data-icon="inline-start" />
        Add item
      </Button>
    </div>
  ),
};

export const Sizes: RenderStory = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const AllVariants: RenderStory = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <Button disabled>Default</Button>
        <Button disabled variant="secondary">
          Secondary
        </Button>
        <Button disabled variant="destructive">
          Destructive
        </Button>
        <Button disabled variant="outline">
          Outline
        </Button>
      </div>
    </div>
  ),
};

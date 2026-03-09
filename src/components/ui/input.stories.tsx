import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "UI/Input",
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithLabel: RenderStory = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 6, width: 300 }}
    >
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="name@example.com" type="email" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled input" },
};

export const File: Story = {
  args: { type: "file" },
};

export const Types: RenderStory = {
  render: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}
    >
      <Input placeholder="Text" type="text" />
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Input placeholder="Number" type="number" />
      <Input placeholder="Search" type="search" />
    </div>
  ),
};

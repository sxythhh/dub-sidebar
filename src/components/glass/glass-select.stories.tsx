import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { GlassSelect } from "./glass-select";

const meta = {
  component: GlassSelect,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/Select",
} satisfies Meta;

export default meta;
type Story = StoryObj;

const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
];

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <GlassSelect
        onValueChange={setValue}
        options={FRUIT_OPTIONS}
        placeholder="Pick a fruit…"
        value={value}
      />
    );
  },
};

export const WithSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState("cherry");
    return (
      <GlassSelect
        onValueChange={setValue}
        options={FRUIT_OPTIONS}
        placeholder="Pick a fruit…"
        value={value}
      />
    );
  },
};

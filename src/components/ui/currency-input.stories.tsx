import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { CurrencyInput } from "./currency-input";

const meta = {
  component: CurrencyInput,
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/CurrencyInput",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return <CurrencyInput onChange={setValue} value={value} />;
  },
};

export const WithValue: Story = {
  render: function Render() {
    const [value, setValue] = useState("25.50");
    return <CurrencyInput onChange={setValue} value={value} />;
  },
};

export const Disabled: Story = {
  render: function Render() {
    const [value, setValue] = useState("100");
    return <CurrencyInput disabled onChange={setValue} value={value} />;
  },
};

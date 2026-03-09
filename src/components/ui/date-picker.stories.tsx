import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DatePicker, DateRangeInputs } from "./date-picker";

const meta = {
  component: DateRangeInputs,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 420, width: 460 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  title: "Glass/DatePicker",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Range: Story = {
  render: function Render() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    return (
      <DateRangeInputs
        endDate={end}
        onChangeEnd={setEnd}
        onChangeStart={setStart}
        startDate={start}
      />
    );
  },
};

export const SingleDate: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: 220 }}>
        <DatePicker onChange={setValue} value={value} />
      </div>
    );
  },
};

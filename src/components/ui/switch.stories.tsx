import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  component: Switch,
  parameters: { layout: "centered" },
  title: "UI/Switch",
} satisfies Meta<typeof Switch>;

export default meta;
type RenderStory = StoryObj<Meta>;

export const Default: RenderStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Checked: RenderStory = {
  render: function Render() {
    const [checked, setChecked] = useState(true);
    return <Switch checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Small: RenderStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} size="sm" />;
  },
};

export const WithLabel: RenderStory = {
  render: function Render() {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <Switch
          checked={checked}
          id="notifications"
          onCheckedChange={setChecked}
        />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
    );
  },
};

export const Disabled: RenderStory = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Switch checked={false} disabled />
      <Switch checked={true} disabled />
    </div>
  ),
};

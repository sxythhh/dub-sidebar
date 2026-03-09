import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  type BudgetRange,
  GlassBudgetPill,
  GlassFilterPill,
  GlassSortPill,
} from "./glass-filter-pill";

const meta = {
  component: GlassFilterPill,
  parameters: { layout: "centered" },
  title: "Glass/FilterPill",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Filter: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <GlassFilterPill
        label="Category"
        onChange={setValue}
        options={[
          "All Categories",
          "Music",
          "Gaming",
          "Entertainment",
          "Lifestyle",
        ]}
        value={value || "All Categories"}
        variant="outline"
      />
    );
  },
};

export const Sort: Story = {
  render: function Render() {
    const [value, setValue] = useState("featured");
    return (
      <GlassSortPill
        defaultValue="featured"
        onChange={setValue}
        options={[
          { label: "Featured", value: "featured" },
          { label: "Newest", value: "newest" },
          { label: "Highest Budget", value: "highest-budget" },
          { label: "Highest CPM", value: "highest-cpm" },
        ]}
        value={value}
      />
    );
  },
};

export const Budget: Story = {
  render: function Render() {
    const [value, setValue] = useState<BudgetRange>({ max: "", min: "" });
    return (
      <GlassBudgetPill
        label="Budget"
        onChange={setValue}
        value={value}
        variant="outline"
      />
    );
  },
};

export const AllPills: Story = {
  render: function Render() {
    const [sort, setSort] = useState("featured");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState<BudgetRange>({ max: "", min: "" });
    return (
      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <GlassSortPill
          defaultValue="featured"
          onChange={setSort}
          options={[
            { label: "Featured", value: "featured" },
            { label: "Newest", value: "newest" },
          ]}
          value={sort}
        />
        <GlassFilterPill
          label="Category"
          onChange={setCategory}
          options={["All Categories", "Music", "Gaming"]}
          value={category || "All Categories"}
          variant="outline"
        />
        <GlassBudgetPill
          label="Budget"
          onChange={setBudget}
          value={budget}
          variant="outline"
        />
      </div>
    );
  },
};

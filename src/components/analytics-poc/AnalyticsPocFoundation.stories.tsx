import type { Meta, StoryObj } from "@storybook/react";
import {
  AnalyticsPocFilterToolbar,
  AnalyticsPocHeader,
  AnalyticsPocPageShell,
  analyticsPocMockData,
} from "./index";

const meta = {
  component: AnalyticsPocPageShell,
  parameters: { layout: "fullscreen" },
  title: "Analytics POC/Foundation",
} satisfies Meta<typeof AnalyticsPocPageShell>;

export default meta;
type RenderStory = StoryObj<Meta>;

export const HeaderAndFilters: RenderStory = {
  render: () => (
    <AnalyticsPocPageShell>
      <AnalyticsPocHeader
        subtitle={analyticsPocMockData.header.subtitle}
        title={analyticsPocMockData.header.title}
      />
      <AnalyticsPocFilterToolbar
        campaignLabel={analyticsPocMockData.filters.campaignLabel}
        dateLabel={analyticsPocMockData.filters.dateLabel}
        platforms={analyticsPocMockData.filters.platforms}
      />
    </AnalyticsPocPageShell>
  ),
};

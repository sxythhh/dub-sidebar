import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, Info, Terminal } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";

const meta = {
  component: Alert,
  parameters: { layout: "centered" },
  title: "UI/Alert",
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj<Meta>;

export const Default: Story = {
  render: () => (
    <Alert style={{ width: 400 }}>
      <Terminal className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert style={{ width: 400 }} {...args}>
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithAction: RenderStory = {
  render: () => (
    <Alert style={{ width: 400 }}>
      <Info className="size-4" />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>A new version is ready to install.</AlertDescription>
      <AlertAction>
        <button className="text-sm underline" type="button">
          Update
        </button>
      </AlertAction>
    </Alert>
  ),
};

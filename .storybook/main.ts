import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: [
    "../public",
    {
      from: "../node_modules/geist/dist/fonts/geist-sans",
      to: "/fonts/geist-sans",
    },
  ],
  stories: ["../src/components/**/*.stories.@(ts|tsx)"],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const { default: tailwindcss } = await import("@tailwindcss/vite");

    return mergeConfig(config, {
      plugins: [tailwindcss()],
    });
  },
};

export default config;

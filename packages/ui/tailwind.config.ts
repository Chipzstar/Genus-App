import type { Config } from "tailwindcss";

import baseConfig from "@genus/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;

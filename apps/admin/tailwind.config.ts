import sharedConfig from "@erp/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  presets: [sharedConfig],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
} satisfies Config;

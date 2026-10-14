import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        foreground: "#F1F5F9",
        card: {
          DEFAULT: "#0F1626",
          foreground: "#F1F5F9",
          hover: "#152036",
        },
        surface: {
          50: "#1E293B",
          100: "#162032",
          200: "#111827",
          300: "#0D1322",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        accent: {
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        border: "rgba(255, 255, 255, 0.08)",
        ring: "#6366F1",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

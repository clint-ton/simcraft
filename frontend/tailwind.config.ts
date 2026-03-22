import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4A843",
        "gold-light": "#E4BE6A",
        "gold-dark": "#B08930",
        bg: "#0a0a0b",
        surface: "#141416",
        "surface-2": "#1c1c1f",
        border: "#2a2a2e",
        "border-light": "#363639",
        muted: "#71717a",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

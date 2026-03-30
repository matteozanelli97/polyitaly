import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          elevated: "var(--bg-elevated)",
          surface: "var(--bg-surface)",
          overlay: "var(--bg-overlay)",
        },
        border: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        accent: {
          primary: "var(--accent-primary)",
          green: "var(--accent-green)",
          red: "var(--accent-red)",
          amber: "var(--accent-amber)",
          blue: "var(--accent-blue)",
          muted: "var(--accent-muted)",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "serif"],
        mono: ["DM Mono", "monospace"],
        sans: ["Geist", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

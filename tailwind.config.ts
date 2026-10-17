import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        foreground: "#f3f4f6",
        surface: {
          50: "#131620",
          100: "#181d2a",
          200: "#1f2638",
          300: "#2a334a",
          border: "rgba(255, 255, 255, 0.08)",
          glass: "rgba(19, 22, 32, 0.75)",
        },
        electric: {
          cyan: "#00f2fe",
          cyanGlow: "rgba(0, 242, 254, 0.25)",
          violet: "#8b5cf6",
          violetGlow: "rgba(139, 92, 246, 0.25)",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.35)",
        "glow-violet": "0 0 25px -5px rgba(139, 92, 246, 0.35)",
        "glow-emerald": "0 0 20px -5px rgba(16, 185, 129, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-glow": "borderGlow 4s ease infinite",
      },
      keyframes: {
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(0, 242, 254, 0.4)" },
          "50%": { borderColor: "rgba(139, 92, 246, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

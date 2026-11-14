import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const line = "rgb(var(--border) / var(--border-alpha))";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        card: token("card"),
        "card-2": token("card-2"),
        border: line,
        input: line,
        muted: token("muted"),
        "muted-foreground": token("muted-foreground"),
        primary: token("primary"),
        indigo: token("indigo"),
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
        ring: token("primary"),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        bangla: ["Noto Sans Bengali", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(56 189 248 / 0.22), 0 10px 40px -14px rgb(99 102 241 / 0.45)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;

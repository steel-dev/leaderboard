/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        text: "var(--color-text)",
        dim: "var(--color-text-muted)",
        accent: "var(--color-accent)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        green: "var(--color-success)",
        gray: {
          DEFAULT: "var(--color-text-muted)",
          dark: "var(--color-text)",
          light: "var(--color-surface-strong)",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          // "SFMono-Regular",
          // "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
        sans: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #9de3f1, #78c8d8)",
        "gradient-logo": "linear-gradient(135deg, #9de3f1, #c2eef7, #86d5e4)",
        "gradient-button": "linear-gradient(83.21deg, #9de3f1 0%, #81cfde 100%)",
      },
      animation: {
        "terminal-blink": "blink 1.25s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};

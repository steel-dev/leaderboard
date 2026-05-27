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
          "Geist Mono",
          "SFMono-Regular",
          "SF Mono",
          "ui-monospace",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #f0c000, #d99a35)",
        "gradient-logo": "linear-gradient(135deg, #f0c000, #edecec, #8a8380)",
        "gradient-button": "linear-gradient(83.21deg, #f0c000 0%, #d99a35 100%)",
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

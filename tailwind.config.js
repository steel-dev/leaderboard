/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        text: "#00ff00",
        dim: "#00aa00",
        accent: "#00ffff",
        error: "#ff0000",
        success: "#00ff00",
        green: "#03FF32",
        gray: {
          DEFAULT: "#00aa00",
          dark: "#005500",
          light: "#00cc00",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
        sans: ['"Geist"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #00ffff, #00ff00)",
        "gradient-logo": "linear-gradient(135deg, #00ffff, #00ff00, #00aaaa)",
        "gradient-button": "linear-gradient(83.21deg, #00ff00 0%, #00ffff 100%)",
        "terminal-grid":
          "linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)",
      },
      animation: {
        "terminal-blink": "blink 1s step-end infinite",
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

// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://leaderboard.steel.dev",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react()],
});

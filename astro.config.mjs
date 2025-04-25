// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100, // poll every 100ms
      },
    },
    plugins: [tailwindcss()],
  },
});

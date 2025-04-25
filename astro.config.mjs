// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  vite: {
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 100, // poll every 100ms
      },
    },
    plugins: [tailwindcss()],
  },
});

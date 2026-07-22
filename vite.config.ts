import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const serviceWorkerFileName = `sw-${Date.now()}.js`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      filename: serviceWorkerFileName,
      injectRegister: "inline",
      workbox: {
        // API navigation requests must reach Nginx instead of receiving the
        // PWA app shell from Workbox's navigation fallback.
        navigateFallbackDenylist: [/^\/api\//, /^\/oauth\/redirect\/catch/],
      },
      manifest: {
        name: "Concierge",
        short_name: "Concierge",
        description: "Personal concierge service",
        theme_color: "#020202",
        background_color: "#020202",
        display: "standalone",
        icons: [
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "build",
  },
  server: {
    host: true,
  },
});

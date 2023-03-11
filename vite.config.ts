import { defineConfig } from "vite";
import path from "node:path";

import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import { VitePWA as pwa } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
      adapter: vercel({ edge: false })
    }),

    pwa({
      registerType: "prompt",
      injectRegister: "auto",

      manifest: {
        name: "Your Private Life",
        short_name: "Your Private Life",
        description: "Your Private Life est un jeu web permettant de faire de la prévention sur les dangers du web et de l'Internet.",

        theme_color: "#000000",
        background_color: "#000000",

        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],

        display: "standalone"
      }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});

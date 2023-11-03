import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: [resolve(__dirname, "src/index.ts")],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
  plugins: [
    react(),
    libInjectCss(),
    dts({
      exclude: [
        resolve(__dirname, "src/main.tsx"),
        resolve(__dirname, "src/App.tsx"),
      ],
    }),
  ],
});

import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: [resolve(__dirname, "src/index.ts")],
      formats: ["es"],
      name: "comment-system-ui",
      fileName: (format) => `comment-system-ui.${format}.js`,
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
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["stream", "util"],
    }),
  ],
});

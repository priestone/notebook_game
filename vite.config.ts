import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/notebook_game/",
  build: {
    outDir: "dist",
    sourcemap: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
      external: ["react", "react-dom", "react-dom/client"],
    },
  },
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.svg"],
  server: {
    historyApiFallback: true,
  },
});

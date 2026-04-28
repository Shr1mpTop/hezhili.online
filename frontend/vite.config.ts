import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          "r3f": ["@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
          gsap: ["gsap"],
        },
      },
    },
  },
});

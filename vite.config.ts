
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure base path is set to root for WebAPK/PWA
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure that the manifest and icons are copied to the build output
    copyPublicDir: true,
    // Optimize for different devices
    target: "esnext",
    // Improve chunk size for mobile
    chunkSizeWarningLimit: 1000,
  },
  // Optimize client-side caching behavior
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  }
}));

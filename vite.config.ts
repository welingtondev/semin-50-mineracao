import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep framer-motion separate as it is a heavy animation library
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Keep Supabase separate so it only loads when required by lazy-loaded components
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Consolidate other libraries to minimize parallel HTTP requests on mobile
            return 'vendor-core';
          }
        }
      }
    },
    // Target modern browsers to reduce polyfill overhead
    target: 'es2020',
    // Inline small assets to reduce HTTP requests
    assetsInlineLimit: 4096,
    // Disable module preloading to prevent downloading unused chunks
    modulePreload: false,
    // Enable CSS code splitting so each lazy chunk gets its own CSS
    cssCodeSplit: true,
    // Produce smaller output
    minify: 'esbuild',
    // No sourcemaps in production for smaller bundles
    sourcemap: false,
  }
}));

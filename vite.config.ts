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
          // Core React — very stable, cache forever
          if (id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'vendor-react';
          }
          // Framer Motion — heavy (~60KB), isolate so pages without it don't pay
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          // UI libraries (carousel, icons)
          if (id.includes('lucide-react') || id.includes('embla-carousel')) {
            return 'vendor-ui';
          }
          // Supabase client
          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase';
          }
          // Radix UI primitives — group to avoid many small chunks
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
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

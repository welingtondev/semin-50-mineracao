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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'embla-carousel-react', 'embla-carousel-autoplay'],
          'vendor-charts': ['recharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    },
    // Target modern browsers to reduce polyfill overhead
    target: 'es2020',
    // Inline small assets to reduce HTTP requests
    assetsInlineLimit: 4096,
    // Disable module preloading to prevent downloading unused chunks (fixes Lighthouse JS warning)
    modulePreload: false,
  }
}));

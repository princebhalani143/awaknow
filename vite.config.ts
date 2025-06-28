import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Fix for SPA routing - serve index.html for all routes
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Development server configuration for SPA routing
  server: {
    historyApiFallback: true,
  },
  // Preview server configuration for SPA routing
  preview: {
    historyApiFallback: true,
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {
        // svgr options
      },
    }),
  ],
  base: './',  // This tells Vite to use relative paths for assets
  server: {
    proxy: {
      // Proxy API requests directly to the backend server without rewriting the path
      // This is important since the backend expects /api/v1 in the path
      '/api': {
        target: 'http://localhost:8005',
        changeOrigin: true,
        secure: false,
        // No rewrite - keep the /api path intact
      },
    },
  },
});

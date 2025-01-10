import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.sandbox.transferwise.tech/v1', // URL gốc của API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ''), // Loại bỏ prefix /api
      },
    },
  },
});

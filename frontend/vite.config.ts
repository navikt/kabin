import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 8063,
    proxy: {
      '/api': 'https://kabin.intern.dev.nav.no',
      '/version': 'https://kabin.intern.dev.nav.no',
    },
  },
});

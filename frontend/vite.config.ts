import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? 'https://cdn.nav.no/klage/kabin/' : '/',
  build: {
    sourcemap: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 8063,
    proxy: {
      '/api': 'https://kabin.intern.dev.nav.no',
      '/version': 'https://kabin.intern.dev.nav.no',
    },
  },
}));

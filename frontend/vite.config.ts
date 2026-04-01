import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }) => ({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  base: command === 'build' ? 'https://cdn.nav.no/klage/kabin/' : '/',
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
}));

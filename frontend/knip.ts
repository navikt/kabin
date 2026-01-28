import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.tsx', 'tailwind.config.js', 'index.css'],
  project: ['src/**'],
  bun: {
    config: ['package.json'],
    entry: ['**/*.test.{ts,tsx}'],
  },
};

export default config;

import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['src/**'],
  bun: {
    config: ['package.json'],
    entry: ['**/*.test.{ts,tsx}'],
  },
};

export default config;

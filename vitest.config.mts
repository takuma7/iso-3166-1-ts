import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    snapshotFormat: { printBasicPrototype: true },
    coverage: { include: ['packages/*/src/**/*.ts'], exclude: ['**/generated/**'] },
  },
});

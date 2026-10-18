import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['cjs', 'esm'],
  target: 'node22',
  dts: true,
  sourcemap: true,
  clean: true,
});

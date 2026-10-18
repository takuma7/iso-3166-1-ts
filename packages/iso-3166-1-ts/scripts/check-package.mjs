import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);
const commonjs = require('..');
const esm = await import(new URL(`../${manifest.module}`, import.meta.url));

assert.deepEqual(Object.keys(commonjs).sort(), Object.keys(esm).sort());
assert.deepEqual(commonjs.records, esm.records);

for (const api of [commonjs, esm]) {
  assert.equal(api.findByAlpha2('us').alpha3, 'USA');
  assert.equal(api.findByAlpha3('afg').numeric, '004');
  assert.equal(api.findByNumeric(4).alpha2, 'AF');
  assert.equal(api.findByNumeric('004').alpha2, 'AF');
  assert.equal(api.findByAlpha2('ZZ'), undefined);
  assert.equal(api.isAlpha2Code('US'), true);
  assert.equal(api.isAlpha2Code('ZZ'), false);
}

console.log(`CommonJS and ESM package checks passed on ${process.version}`);

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const commonjs = require('..');
const esm = await import('../dist/index.mjs');
assert.equal(typeof commonjs.getTable, 'function');
assert.equal(typeof esm.getTable, 'function');
const help = execFileSync(process.execPath, [new URL('../bin/cli.js', import.meta.url).pathname, '--help'], { encoding: 'utf8' });
assert.match(help, /--output/);
console.log(`Scraper API and CLI checks passed on ${process.version}`);

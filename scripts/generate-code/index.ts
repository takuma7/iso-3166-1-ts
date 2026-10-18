import { readFile, writeFile } from 'node:fs/promises';

import { getData } from './get-data';
import { generateCode } from './generate-code';

const output = new URL('../../packages/iso-3166-1-ts/src/generated/iso-3166-1-records.ts', import.meta.url);

try {
  const source = generateCode(await getData());
  if (process.argv.includes('--check')) {
    if (await readFile(output, 'utf8') !== source) {
      throw new Error('Generated country data is out of date. Run pnpm generate-code.');
    }
    console.log('CSV and generated TypeScript are in sync.');
  } else {
    await writeFile(output, source);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import { writeCsv } from './write-csv';

test('creates directories and quotes CSV fields without losing leading zeroes', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'country-codes-'));
  try {
    const output = path.join(directory, 'nested', 'countries.csv');
    expect(await writeCsv(output, [['Name', 'Numeric'], ['Example, country', '004']])).toBe(output);
    expect(await readFile(output, 'utf8')).toBe('Name,Numeric\n"Example, country",004\n');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

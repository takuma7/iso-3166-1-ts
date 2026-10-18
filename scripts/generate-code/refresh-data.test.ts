import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'csv-parse/sync';
import { expect, test } from 'vitest';
import { refreshData } from './refresh-data';
import { generateCode } from './generate-code';
import { parseData } from './get-data';

test('a truncated refresh leaves both previous artifacts intact; a complete refresh updates both', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'iso-refresh-'));
  const paths = { csv: pathToFileURL(join(directory, 'data.csv')), source: pathToFileURL(join(directory, 'data.ts')) };
  try {
    await writeFile(paths.csv, 'previous CSV');
    await writeFile(paths.source, 'previous source');
    const csv = await readFile(new URL('../../data/iso-3166-1.csv', import.meta.url), 'utf8');
    const [headers, ...rows]: string[][] = parse(csv);
    await expect(refreshData({ headers, rows: rows.slice(0, 3) }, paths)).rejects.toThrow('Incomplete country snapshot');
    expect(await readFile(paths.csv, 'utf8')).toBe('previous CSV');
    expect(await readFile(paths.source, 'utf8')).toBe('previous source');
    await refreshData({ headers, rows }, paths);
    expect(parseData(await readFile(paths.csv, 'utf8'))).toEqual(parseData(csv));
    expect(await readFile(paths.source, 'utf8')).toBe(generateCode(parseData(csv)));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

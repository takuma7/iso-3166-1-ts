import { writeFile } from 'node:fs/promises';
import { stringify } from 'csv-stringify/sync';
import type { CountryTable } from '../../packages/get-country-codes/src/scrape-page';
import { parseData, readRequiredCodes, validateSnapshot } from './get-data';
import { generateCode } from './generate-code';

export async function refreshData(table: CountryTable, paths = {
  csv: new URL('../../data/iso-3166-1.csv', import.meta.url),
  source: new URL('../../packages/iso-3166-1-ts/src/generated/iso-3166-1-records.ts', import.meta.url),
}): Promise<void> {
  const csv = stringify([table.headers, ...table.rows]);
  const records = parseData(csv);
  validateSnapshot(records, await readRequiredCodes());
  const source = generateCode(records);
  // Finish all validation before modifying either checked-in artifact.
  await writeFile(paths.csv, csv);
  await writeFile(paths.source, source);
}

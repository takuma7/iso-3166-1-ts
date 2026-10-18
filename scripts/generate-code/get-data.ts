import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

import type { ISO_3166_1_Record } from '../../packages/iso-3166-1-ts/src/types/record';

const fields = {
  name: 'English short name',
  name_fr: 'French short name',
  alpha2: 'Alpha-2 code',
  alpha3: 'Alpha-3 code',
  numeric: 'Numeric',
} as const;

export const parseData = (csv: string): ISO_3166_1_Record[] => {
  const rows: Record<string, string>[] = parse(csv, {
    bom: true,
    skip_empty_lines: true,
    columns: (headers: string[]) => {
      const missing = Object.values(fields).filter(field => !headers.includes(field));
      if (missing.length) throw new Error(`Missing CSV columns: ${missing.join(', ')}`);
      return headers;
    },
  });
  if (!rows.length) throw new Error('Country data must not be empty');

  const seen = { alpha2: new Set<string>(), alpha3: new Set<string>(), numeric: new Set<string>() };
  return rows.map((row, index) => {
    const record: ISO_3166_1_Record = {
      name: row[fields.name],
      name_fr: row[fields.name_fr],
      alpha2: row[fields.alpha2],
      alpha3: row[fields.alpha3],
      numeric: row[fields.numeric],
    };
    if (!record.name?.trim() || !record.name_fr?.trim() ||
        !/^[A-Z]{2}$/.test(record.alpha2) || !/^[A-Z]{3}$/.test(record.alpha3) ||
        !/^\d{3}$/.test(record.numeric)) {
      throw new Error(`Invalid country data on CSV row ${index + 2}`);
    }
    for (const key of ['alpha2', 'alpha3', 'numeric'] as const) {
      if (seen[key].has(record[key])) throw new Error(`Duplicate ${key} code: ${record[key]}`);
      seen[key].add(record[key]);
    }
    return record;
  });
};

export const validateSnapshot = (
  records: ISO_3166_1_Record[], requiredCodes: unknown
): void => {
  if (!Array.isArray(requiredCodes) || !requiredCodes.length ||
      requiredCodes.some(code => typeof code !== 'string' || !/^[A-Z]{2}$/.test(code)) ||
      new Set(requiredCodes).size !== requiredCodes.length) {
    throw new Error('Invalid reviewed country-code baseline');
  }
  const found = new Set(records.map(record => record.alpha2));
  const missing = requiredCodes.filter(code => !found.has(code));
  if (missing.length) {
    throw new Error(`Incomplete country snapshot: missing ${missing.length} reviewed codes (${missing.join(', ')}). Review removals explicitly in data/required-alpha2-codes.json.`);
  }
};

export const readRequiredCodes = async (): Promise<unknown> => JSON.parse(
  await readFile(new URL('../../data/required-alpha2-codes.json', import.meta.url), 'utf8')
);

export const getData = async (
  source: string | URL = new URL('../../data/iso-3166-1.csv', import.meta.url)
): Promise<ISO_3166_1_Record[]> => {
  const records = parseData(await readFile(source, 'utf8'));
  validateSnapshot(records, await readRequiredCodes());
  return records;
};

import { parse } from 'csv-parse/sync';

import { ISO_3166_1_Record } from '../../src/types/record';

export const getData = async (): Promise<ISO_3166_1_Record[]> => {
  const response = await fetch(
    'https://raw.githubusercontent.com/takuma7/iso-3166-1-csv/main/iso-3166-1.csv',
    { signal: AbortSignal.timeout(30_000) }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch country codes: ${response.status}`);
  }
  const data = await response.text();
  const records: Record<string, string>[] = parse(data, { columns: true });
  return records.map(record => ({
    name: record['English short name'],
    name_fr: record['French short name'],
    alpha2: record['Alpha-2 code'],
    alpha3: record['Alpha-3 code'],
    numeric: record['Numeric'],
  }));
};

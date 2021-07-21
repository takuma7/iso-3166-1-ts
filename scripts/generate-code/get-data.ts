import parse from 'csv-parse/lib/sync';
import got from 'got';

import { ISO_3166_1_Record } from '../../src/types/record';

export const getData = async (): Promise<ISO_3166_1_Record[]> => {
  const data = await got
    .get(
      'https://raw.githubusercontent.com/takuma7/iso-3166-1-csv/main/iso-3166-1.csv'
    )
    .text();
  const records: Record<string, string>[] = parse(data, { columns: true });
  return records.map(record => ({
    name: record['English short name'],
    name_fr: record['French short name'],
    alpha2: record['Alpha-2 code'],
    alpha3: record['Alpha-3 code'],
    numeric: record['Numeric'],
  }));
};

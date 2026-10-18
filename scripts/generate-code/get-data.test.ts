import { expect, test } from 'vitest';
import { getData, parseData } from './get-data';
import { generateCode } from './generate-code';
import { readFile } from 'node:fs/promises';

const header = 'English short name,French short name,Alpha-2 code,Alpha-3 code,Numeric\n';
const afghanistan = "Afghanistan,Afghanistan (l'),AF,AFG,004\n";

test('parses quoted CSV fields and preserves leading zeroes', () => {
  expect(parseData(header + '"Example, country",Exemple,AF,AFG,004\n')).toEqual([{
    name: 'Example, country', name_fr: 'Exemple', alpha2: 'AF', alpha3: 'AFG', numeric: '004',
  }]);
});

test.each(['', header])('rejects empty data', csv => {
  expect(() => parseData(csv)).toThrow('must not be empty');
});

test('rejects missing columns', () => {
  expect(() => parseData('name,code\nAfghanistan,AF\n')).toThrow('Missing CSV columns');
});

test.each([
  ',Afghanistan,AF,AFG,004\n',
  'Afghanistan,,AF,AFG,004\n',
  'Afghanistan,Afghanistan,af,AFG,004\n',
  'Afghanistan,Afghanistan,AF,afg,004\n',
  'Afghanistan,Afghanistan,AF,AFG,4\n',
])('rejects invalid country data', row => {
  expect(() => parseData(header + row)).toThrow('Invalid country data');
});

test.each([
  'Another,Autre,AF,AAA,999\n',
  'Another,Autre,AA,AFG,999\n',
  'Another,Autre,AA,AAA,004\n',
])('rejects duplicate country codes', row => {
  expect(() => parseData(header + afghanistan + row)).toThrow('Duplicate');
});

test('local CSV matches the generated library source', async () => {
  const records = await getData();
  expect(records.find(record => record.alpha2 === 'AF')?.numeric).toBe('004');
  const generated = await readFile(new URL('../../packages/iso-3166-1-ts/src/generated/iso-3166-1-records.ts', import.meta.url), 'utf8');
  expect(generateCode(records)).toBe(generated);
});

test('rejects a valid but truncated CSV against the independent baseline', async () => {
  const { validateSnapshot, readRequiredCodes } = await import('./get-data');
  expect(() => validateSnapshot(parseData(header + afghanistan), ['AF', 'JP'])).toThrow('missing 1 reviewed codes (JP)');
  expect(() => validateSnapshot(parseData(header + afghanistan), ['AF'])).not.toThrow();
  const threeCountries = parseData(header + afghanistan + 'Japan,Japon,JP,JPN,392\nUnited States,États-Unis,US,USA,840\n');
  const required = await readRequiredCodes();
  expect(() => validateSnapshot(threeCountries, required)).toThrow('Incomplete country snapshot');
});

test.each([null, [], ['AF', 'AF'], ['bad'], [42]])('rejects invalid baselines: %j', async baseline => {
  const { validateSnapshot } = await import('./get-data');
  expect(() => validateSnapshot(parseData(header + afghanistan), baseline)).toThrow('Invalid reviewed');
});

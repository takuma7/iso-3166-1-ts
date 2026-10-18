import { afterEach, expect, test, vi } from 'vitest';
import { getData } from './get-data';

afterEach(() => vi.unstubAllGlobals());

test('parses quoted CSV fields and preserves leading zeroes', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
    'English short name,French short name,Alpha-2 code,Alpha-3 code,Numeric\n"Example, country",Exemple,EX,EXP,004\n'
  )));

  await expect(getData()).resolves.toEqual([{
    name: 'Example, country',
    name_fr: 'Exemple',
    alpha2: 'EX',
    alpha3: 'EXP',
    numeric: '004',
  }]);
});

test('rejects unsuccessful HTTP responses', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not found', { status: 404 })));
  await expect(getData()).rejects.toThrow('Failed to fetch country codes: 404');
});

test('propagates network failures', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));
  await expect(getData()).rejects.toThrow('Network failure');
});

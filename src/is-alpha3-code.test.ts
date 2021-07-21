import { alpha3Codes } from './generated/iso-3166-1-records';
import { isAlpha3Code } from './is-alpha3-code';

test.each(alpha3Codes)('isAlpha3Code(%j) should return true', code => {
  expect(isAlpha3Code(code)).toBe(true);
});

test.each(['', 'ZZ', 'ZZZ', 'ZZZZ'])(
  'isAlpha3Code(%j) should return false',
  code => {
    expect(isAlpha3Code(code)).toBe(false);
  }
);

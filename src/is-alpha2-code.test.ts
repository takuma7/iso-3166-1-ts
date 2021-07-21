import { alpha2Codes } from './generated/iso-3166-1-records';
import { isAlpha2Code } from './is-alpha2-code';

test.each(alpha2Codes)('isAlpha2Code(%j) should return true', code => {
  expect(isAlpha2Code(code)).toBe(true);
});

test.each(['', 'ZZ', 'USA'])('isAlpha2Code(%j) should return false', code => {
  expect(isAlpha2Code(code)).toBe(false);
});

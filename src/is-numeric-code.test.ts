import { numericCodes } from './generated/iso-3166-1-records';
import { isNumericCode } from './is-numeric-code';

test.each(numericCodes)('isNumericCode(%j) should return true', code => {
  expect(isNumericCode(code)).toBe(true);
});

test.each(['', '0', '00', '000', '0000'])(
  'isNumericCode(%j) should return false',
  code => {
    expect(isNumericCode(code)).toBe(false);
  }
);

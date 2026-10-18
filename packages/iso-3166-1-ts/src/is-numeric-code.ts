import { numericCodes, NumericCode } from './generated/iso-3166-1-records';

export const isNumericCode = (code: string): code is NumericCode => {
  return code.length === 3 && numericCodes.includes(code as NumericCode);
};

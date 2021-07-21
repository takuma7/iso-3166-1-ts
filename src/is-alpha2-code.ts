import { alpha2Codes, Alpha2Code } from './generated/iso-3166-1-records';

export const isAlpha2Code = (code: string): code is Alpha2Code => {
  return code.length === 2 && alpha2Codes.includes(code as Alpha2Code);
};

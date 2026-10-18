import { alpha3Codes, Alpha3Code } from './generated/iso-3166-1-records';

export const isAlpha3Code = (code: string): code is Alpha3Code => {
  return code.length === 3 && alpha3Codes.includes(code as Alpha3Code);
};

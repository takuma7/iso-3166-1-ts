import { ISO_3166_1_Record } from '../types/record';
import { records } from '../generated/iso-3166-1-records';

/**
 * Finds a record by its Alpha-2 code
 *
 * @example
 * ```ts
 * console.log(findByAlpha2('JP'))
 * // Output:
 * // {
 * //   alpha2: "JP",
 * //   alpha3: "JPN",
 * //   name: "Japan",
 * //   name_fr: "Japon (le)",
 * //   numeric: "392",
 * // }
 * ```
 * @example
 * Lowercase Alpha-2 codes are also supported.
 * ```ts
 * console.log(findByAlpha2('jp'))
 * // Output:
 * // {
 * //   alpha2: "JP",
 * //   alpha3: "JPN",
 * //   name: "Japan",
 * //   name_fr: "Japon (le)",
 * //   numeric: "392",
 * // }
 * ```
 */
export const findByAlpha2 = (code: string): ISO_3166_1_Record | undefined => {
  const normalizedCode = code.toUpperCase();
  return records.find(record => record.alpha2 === normalizedCode);
};

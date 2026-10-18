import { ISO_3166_1_Record } from '../types/record';
import { records } from '../generated/iso-3166-1-records';

/**
 * Finds a record by its Alpha-3 code
 *
 * @example
 * ```ts
 * console.log(findByAlpha3('JPN'))
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
 * Lowercase Alpha-3 codes are also supported.
 * ```ts
 * console.log(findByAlpha3('jpn'))
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
export const findByAlpha3 = (code: string): ISO_3166_1_Record | undefined => {
  const normalizedCode = code.toUpperCase();
  return records.find(record => record.alpha3 === normalizedCode);
};

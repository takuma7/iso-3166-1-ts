import { ISO_3166_1_Record } from '../types/record';
import { records } from '../generated/iso-3166-1-records';

/**
 * Finds a record by its numeric code
 *
 * @example
 * ```ts
 * console.log(findByNumeric('392'))
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
 * Numbers can be also passed.
 * ```ts
 * console.log(findByNumeric(392))
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
export const findByNumeric = (
  code: string | number
): ISO_3166_1_Record | undefined => {
  const normalizedCode = String(code).padStart(3, '0');
  return records.find(record => record.numeric === normalizedCode);
};

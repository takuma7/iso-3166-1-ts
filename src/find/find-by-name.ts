import { ISO_3166_1_Record } from '../types/record';
import { records } from '../generated/iso-3166-1-records';

/**
 * Finds a record by its English short name
 */
export const findByName = (code: string): ISO_3166_1_Record | undefined => {
  return records.find(record => record.name === code);
};

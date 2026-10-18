import { getTable } from '../packages/get-country-codes/src/get-table';
import { refreshData } from './generate-code/refresh-data';

try {
  await refreshData(await getTable());
  console.log('Validated and updated the CSV and generated TypeScript.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

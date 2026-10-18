import fs from 'node:fs';

import { getData } from './get-data';
import { generateCode } from './generate-code';

getData()
  .then(generateCode)
  .then(source => {
    fs.writeFileSync('./src/generated/iso-3166-1-records.ts', source);
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });

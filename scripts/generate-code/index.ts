import fs from 'fs';
import shell from 'shelljs';

import { getData } from './get-data';
import { generateCode } from './generate-code';

getData()
  .then(generateCode)
  .then(source => {
    fs.writeFileSync('./src/generated/iso-3166-1-records.ts', source);
    shell.exec('yarn lint --fix');
  });

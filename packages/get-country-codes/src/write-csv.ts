import fs from 'fs'
import path from 'path'

import { stringify } from 'csv-stringify/sync'

export const writeCsv = async (
  filePath: string,
  data: string[][]
): Promise<string> => {
  const csv = stringify(data)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, csv)
  return filePath
}

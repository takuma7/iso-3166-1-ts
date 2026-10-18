import path from 'path'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { getTable } from './get-table'
import { writeCsv } from './write-csv'
import { run } from './run'

const argv = yargs(hideBin(process.argv))
  .options({
    output: {
      alias: 'o',
      default: `iso-3166.csv`,
      type: 'string',
    },
  })
  .parseSync()

;(async () => {
  const { headers, rows } = await getTable()
  const table = [headers, ...rows]

  let outputPath = argv.output
  if (!path.isAbsolute(outputPath)) {
    outputPath = path.resolve(process.cwd(), outputPath)
  }

  await run('Writing csv', writeCsv(outputPath, table), {
    succeedText: ({ result, text }) => {
      return `${text}... Wrote to ${result}`
    },
  })
})().catch((e) => {
  console.error(e)
  process.exit(1)
})

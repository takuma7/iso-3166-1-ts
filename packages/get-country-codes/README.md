# get-country-codes

Extract the ISO 3166-1 country-code table from [ISO's website](https://www.iso.org/obp/ui/#search)
and write it as CSV. This package is maintained in the
[`iso-3166-1-ts` workspace](https://github.com/takuma7/iso-3166-1-ts).

## CLI

```sh
npm install --global get-country-codes
get-country-codes --output ./iso-3166-1.csv
```

`--output` (or `-o`) accepts an output path. If omitted, the CLI writes
`iso-3166.csv` in the current directory. Parent directories are created as needed.
The scraper needs Puppeteer's browser; standard npm installation installs it.

## API

```ts
import { getTable } from 'get-country-codes';

const { headers, rows } = await getTable();
```

`getTable()` returns `Promise<{ headers: string[]; rows: string[][] }>` and closes
its browser when extraction finishes or fails. Both the API and CLI require
Node.js 22.12 or newer.

## Workspace development

The workspace skips Puppeteer's automatic browser download so library development
and offline tests do not require a browser. Install it explicitly before scraping:

```sh
pnpm --filter get-country-codes exec puppeteer browsers install chrome
pnpm data:update
```

Run these commands from the repository root. See the
[workspace guide](https://github.com/takuma7/iso-3166-1-ts#development) for the full
workflow. The checked-in [CSV](https://github.com/takuma7/iso-3166-1-ts/blob/main/data/iso-3166-1.csv)
is available without running the scraper.

## License

[MIT](LICENSE).

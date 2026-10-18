# get-country-codes

Fetches the canonical ISO 3166-1 country codes from [ISO's website](https://www.iso.org/obp/ui/#search) and writes to a CSV file.

If your only interest is to get the CSV file, you can check  [`takuma7/iso-3166-1-csv`](https://github.com/takuma7/iso-3166-1-csv) out.

## CLI

Installation:
```sh
pnpm add --global get-country-codes
```

Usage:
```sh
get-country-codes -o ./out/iso-3166-1.csv # You can specify the output path (default: ./iso-3166-1.csv)
```

## API

### getTable

Gets the country codes table from the ISO website.

`getTable(): Promise<{ headers: string[]; rows: string[][] }>`

Usage:

```ts
const { headers, rows } = await getTable()
```

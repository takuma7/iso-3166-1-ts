# iso-3166-1-ts

[![CI](https://github.com/takuma7/iso-3166-1-ts/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/takuma7/iso-3166-1-ts/actions/workflows/main.yml)
[![npm version](https://img.shields.io/npm/v/iso-3166-1-ts)](https://www.npmjs.com/package/iso-3166-1-ts)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-339933?logo=nodedotjs&logoColor=white)](#nodejs-support)
[![MIT license](https://img.shields.io/github/license/takuma7/iso-3166-1-ts)](LICENSE)

ISO 3166-1 country codes and TypeScript types, with the scraper and CSV dataset
maintained in the same repository. Data updates can be reviewed from source to
published library in a single pull request.

| Project | Purpose | Documentation |
| --- | --- | --- |
| `iso-3166-1-ts` | Country lookups, validation, data, and literal TypeScript types; no runtime dependencies | [Library guide](packages/iso-3166-1-ts/README.md) |
| `get-country-codes` | Scraper API and CLI that extract ISO's country-code table | [Scraper guide](packages/get-country-codes/README.md) |
| CSV dataset | Country names and Alpha-2, Alpha-3, and numeric codes | [CSV file](data/iso-3166-1.csv) |

## Use the library

```sh
npm install iso-3166-1-ts
```

```ts
import { findByAlpha2, isAlpha2Code } from 'iso-3166-1-ts';
import type { Alpha2Code } from 'iso-3166-1-ts';

findByAlpha2('jp'); // Japan's country record
isAlpha2Code('JP'); // true
const country: Alpha2Code = 'JP';
```

CommonJS and ESM builds are included. See the [library guide](packages/iso-3166-1-ts/README.md)
for name and numeric lookups, validation, and the complete data exports.

## Use the scraper

```sh
npm install --global get-country-codes
get-country-codes --output ./iso-3166-1.csv
```

The scraper uses Puppeteer and needs its browser installed. For local workspace
usage, follow the browser installation step below. Library users do not install
Puppeteer or download a browser.

## Repository layout

```text
packages/
  iso-3166-1-ts/       Library source, build, and tests
  get-country-codes/   Scraper API and CLI
data/                Canonical CSV dataset
scripts/generate-code/ CSV validation and TypeScript generation
docs/                API reference and migration notes
```

The two npm packages retain their existing names. This repository consolidates
`get-country-codes`, `iso-3166-1-csv`, and `iso-3166-1-ts`; their original Git
histories and licenses are preserved. See the [migration notes](docs/migration.md)
for legacy repository links and the cutover sequence.

## Node.js support

Both packages support maintained Node.js LTS release lines, currently 22 and 24.
The library targets Node.js 22; the scraper requires Node.js 22.12 or newer. CI tests both packages on each release line. Node.js
24 is the development default in `.nvmrc`. New LTS lines should be added to the
matrix when they enter LTS; dropping an older line is an explicit compatibility
change.

## Development

Use Node.js 24 and pnpm 12.14.0. Run these commands from the repository root:

```sh
nvm use
npm install --global pnpm@12.14.0
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test --coverage
pnpm build
pnpm test:package
pnpm size
pnpm run docs
```

`pnpm start` watches the library source. To run a command for a specific package,
use `pnpm --filter iso-3166-1-ts <command>` or `pnpm --filter get-country-codes <command>`.
Shared build and test tools are development dependencies of the private workspace
root. Each public package declares its own runtime dependencies.

## Update country data

The checked-in [CSV](data/iso-3166-1.csv) is the source for the library. Generation
and the library checks do not fetch data from the network or launch a browser:

```sh
pnpm generate-code # Regenerate TypeScript from the local CSV
pnpm data:check    # Validate the CSV and check that generated source matches
```

To refresh the CSV from ISO, install the scraper's browser explicitly:

```sh
pnpm --filter get-country-codes exec puppeteer browsers install chrome
pnpm data:update
```

On Linux, install Chrome's system libraries with administrator privileges;
install Puppeteer's browser as your normal user. The update workflow shows the
required Ubuntu packages. Browser installation with `--install-deps` requires root.

The `data:update` command validates the scraped candidate before writing the CSV
and generated TypeScript. Review and commit both files together. Validation
rejects empty data, missing columns, malformed or duplicate codes, and missing
countries from the independent [reviewed baseline](data/required-alpha2-codes.json).
New codes are allowed. Add reviewed new codes to the baseline to protect them
in future refreshes. An official withdrawal requires an explicit, reviewed edit
to the baseline; automatic refreshes never change it.

The scraper finds controls by their labels, waits for loaded rows, follows result
pages, and checks the extracted row count against ISO's reported total. It fails
on security-verification pages rather than writing partial data. ISO may block
automated access; a successful fixture test does not guarantee live access.
Run `pnpm test:browser` after installing Chrome to exercise local browser fixtures.
CI runs these fixtures separately from the Node.js compatibility checks.

The **Update country data** workflow runs monthly and can be started manually.
It validates the refreshed data, tests both packages, and proposes a pull request
containing only the CSV and generated source. It explicitly dispatches the CI
workflows because PRs created with `GITHUB_TOKEN` do not trigger them automatically.
The repository must allow GitHub Actions to create pull requests. Updates require
review and are not automatically merged or published.

## Package releases

The workspace root is private. Build and validate both packages, then pack or
publish each package independently from its directory:

```sh
pnpm --filter iso-3166-1-ts pack --pack-destination /tmp
pnpm --filter get-country-codes pack --pack-destination /tmp
```

Choose a new version for each package being released before publishing. Library
versions must be newer than the already published `0.2.2`; the imported scraper
version is `0.0.2`. No npm release is part of the repository migration.

## License

[MIT](LICENSE). Imported projects retain their original license files.

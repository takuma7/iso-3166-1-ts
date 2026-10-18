**iso-3166-1-ts**

***

# iso-3166-1-ts

[![CI](https://github.com/takuma7/iso-3166-1-ts/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/takuma7/iso-3166-1-ts/actions/workflows/main.yml)
[![npm version](https://img.shields.io/npm/v/iso-3166-1-ts)](https://www.npmjs.com/package/iso-3166-1-ts)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-339933?logo=nodedotjs&logoColor=white)](#nodejs-support)
[![MIT license](https://img.shields.io/github/license/takuma7/iso-3166-1-ts)](LICENSE)

ISO 3166-1 country codes, country names, lookup functions, and TypeScript types.
Data is bundled with the package, so lookups work offline without runtime
dependencies. CommonJS and ESM builds are included.

## Installation

Requires Node.js 22 or newer. Install with your preferred package manager:

```sh
npm install iso-3166-1-ts
# or
pnpm add iso-3166-1-ts
# or
yarn add iso-3166-1-ts
```

## Usage

### Find a country

Look up a country by its two-letter code, three-letter code, or numeric code:

```ts
import {
  findByAlpha2,
  findByAlpha3,
  findByNumeric,
} from 'iso-3166-1-ts';

console.log(findByAlpha2('AF'));
// {
//   name: 'Afghanistan',
//   name_fr: "Afghanistan (l')",
//   alpha2: 'AF',
//   alpha3: 'AFG',
//   numeric: '004',
// }

// Each lookup below returns the same country record.
findByAlpha2('af');
findByAlpha3('AFG');
findByAlpha3('afg');
findByNumeric('004');
findByNumeric(4);

findByAlpha2('ZZ'); // undefined
```

Alpha-2 and Alpha-3 lookups are case-insensitive. Numeric lookups accept strings
or numbers; returned records always store numeric codes as three-character
strings, preserving leading zeroes. All lookup functions return `undefined`
when no match is found.

You can also look up a country by its exact English or French short name:

```ts
import { findByName, findByNameFr } from 'iso-3166-1-ts';

findByName('Afghanistan');
findByNameFr("Afghanistan (l')");
```

Name lookups are case-sensitive and use the names stored in the bundled data,
including punctuation and articles.

### Validate a code

Use the type guards to validate strings and narrow their TypeScript types:

```ts
import {
  isAlpha2Code,
  isAlpha3Code,
  isNumericCode,
} from 'iso-3166-1-ts';

const input: string = 'US';
if (isAlpha2Code(input)) {
  // input is narrowed to Alpha2Code here.
  console.log(input);
}

isAlpha2Code('US'); // true
isAlpha2Code('us'); // false
isAlpha3Code('USA'); // true
isNumericCode('004'); // true
isNumericCode('4'); // false
```

Type guards require uppercase letter codes and three-character numeric strings.

### Access the data

The package exports the full dataset and readonly arrays of its values:

```ts
import {
  records,
  alpha2Codes,
  alpha3Codes,
  numericCodes,
  names,
  namesFr,
} from 'iso-3166-1-ts';

records[0]; // A record with name, name_fr, alpha2, alpha3, and numeric fields.
alpha2Codes.includes('JP'); // true
alpha3Codes.includes('JPN'); // true
numericCodes.includes('392'); // true
names.includes('Japan'); // true
namesFr.includes('Japon (le)'); // true
```

### Use TypeScript types

Literal union types help catch invalid country codes at compile time:

```ts
import type { Alpha2Code } from 'iso-3166-1-ts';

interface User {
  name: string;
  country: Alpha2Code;
}

const user: User = { name: 'Ada', country: 'JP' };

// @ts-expect-error: 'ZZ' is not a valid Alpha-2 code.
const invalidUser: User = { name: 'Ada', country: 'ZZ' };
```

Other exported types include `Alpha3Code`, `NumericCode`, `EnglishShortName`,
`FrenchShortName`, and the `ISO_3166_1_Record` interface. See the
[API reference](https://github.com/takuma7/iso-3166-1-ts/blob/main/docs/api/globals.md) for the complete list of exports.

## Node.js support

The library supports all Node.js LTS release lines that are still maintained.
Currently, these are Node.js 22 and 24. CI runs the tests, build, type checks,
and CommonJS/ESM entry-point checks on both release lines.

The build targets Node.js 22, the oldest supported LTS line. New LTS lines should
be added to the CI matrix when they enter LTS. Dropping an older line requires
an explicit compatibility change. See the
[official Node.js release schedule](https://github.com/nodejs/Release/blob/main/schedule.json).

## Data source

Country names and codes are generated from the CSV maintained in this repository:
[`data/iso-3166-1.csv`](https://github.com/takuma7/iso-3166-1-ts/blob/main/data/iso-3166-1.csv).
The `get-country-codes` workspace package extracts that data from ISO's website.
Each library release bundles a snapshot and performs no network requests.

## Development

See the [workspace guide](https://github.com/takuma7/iso-3166-1-ts#development)
for installation, testing, data updates, and package releases. All development
commands run from the repository root.

## License

[MIT](_media/LICENSE).

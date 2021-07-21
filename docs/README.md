iso-3166-1-ts / [Exports](modules.md)

# iso-3166-1-ts

Provides ISO 3166-1 values and types. Country codes are fetched from [`takuma7/iso-3166-1-csv`](https://github.com/takuma7/iso-3166-1-csv/blob/main/iso-3166-1.csv), which contains up-to-date canonical codes scraped from ISO's website.

## Installation

```sh
yarn add iso-3166-1-ts
```

## Usage

`findBy*` methods let you find an ISO 3166-1 record. If not found, they return `undefined`.

```ts
import {
  findByAlpha2,
  findByAlpha3,
  findByNumeric,
} from 'iso-3166-1-ts'

console.log(findByAlpha2('AF'))
console.log(findByAlpha2('af'))
console.log(findByAlpha3('AFG'))
console.log(findByAlpha3('afg'))
console.log(findByNumeric('004'))
console.log(findByNumeric(4))
// All the above will output:
// {
//   alpha2: "AF",
//   alpha3: "AFG",
//   name: "Afghanistan",
//   name_fr: "Afghanistan (l')",
//   numeric: "004",
// }

```

This package also exports the data so you can play with it as you wish:

```ts
import {
  records,
  alpha2Codes,
  alpha3Codes,
  names,
  namesFr,
} from 'iso-3166-1-ts'

alpha2Codes.forEach((code) => {
  // e.g.) Get more information from ISO website
  const url = `https://www.iso.org/obp/ui/#iso:code:3166:${code}`
  // ...
})
```

You can also use types:

```ts
import { Alpha2Code } from 'iso-3166-1-ts'

export interface User {
  name: string
  country: Alpha2Code
}

const u: User = { name: 'foo', country: 'whatever' } // doesn't compile
```

For more details, please refer to [the API reference](./docs/modules.md).

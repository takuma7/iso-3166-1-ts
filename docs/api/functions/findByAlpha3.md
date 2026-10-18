[**iso-3166-1-ts**](../README.md)

***

[iso-3166-1-ts](../globals.md) / findByAlpha3

# Function: findByAlpha3()

> **findByAlpha3**(`code`): [`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

Defined in: find/find-by-alpha3.ts:33

Finds a record by its Alpha-3 code

## Parameters

### code

`string`

## Returns

[`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

## Examples

```ts
console.log(findByAlpha3('JPN'))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

Lowercase Alpha-3 codes are also supported.
```ts
console.log(findByAlpha3('jpn'))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

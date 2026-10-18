[**iso-3166-1-ts**](../README.md)

***

[iso-3166-1-ts](../globals.md) / findByAlpha2

# Function: findByAlpha2()

> **findByAlpha2**(`code`): [`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

Defined in: find/find-by-alpha2.ts:33

Finds a record by its Alpha-2 code

## Parameters

### code

`string`

## Returns

[`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

## Examples

```ts
console.log(findByAlpha2('JP'))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

Lowercase Alpha-2 codes are also supported.
```ts
console.log(findByAlpha2('jp'))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

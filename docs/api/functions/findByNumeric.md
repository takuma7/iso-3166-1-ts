[**iso-3166-1-ts**](../README.md)

***

[iso-3166-1-ts](../globals.md) / findByNumeric

# Function: findByNumeric()

> **findByNumeric**(`code`): [`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

Defined in: find/find-by-numeric.ts:33

Finds a record by its numeric code

## Parameters

### code

`string` \| `number`

## Returns

[`ISO_3166_1_Record`](../interfaces/ISO_3166_1_Record.md) \| `undefined`

## Examples

```ts
console.log(findByNumeric('392'))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

Numbers can be also passed.
```ts
console.log(findByNumeric(392))
// Output:
// {
//   alpha2: "JP",
//   alpha3: "JPN",
//   name: "Japan",
//   name_fr: "Japon (le)",
//   numeric: "392",
// }
```

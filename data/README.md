# ISO 3166-1 country data

[`iso-3166-1.csv`](iso-3166-1.csv) is the canonical local dataset used to generate
the `iso-3166-1-ts` library. It contains English and French short names, Alpha-2
and Alpha-3 codes, and three-character numeric codes with leading zeroes.

The dataset was imported from `takuma7/iso-3166-1-csv` at commit
`5a5de10bdc3407d2e4a76673155e8cc609a0fe3c`. Its original history and [license](LICENSE)
are preserved.

Run `pnpm data:update` from the workspace root to scrape ISO and regenerate the
library, or `pnpm generate-code` to regenerate from this file without network
access. Review the CSV and generated source together before merging an update.
See the [workspace guide](../README.md#update-country-data).

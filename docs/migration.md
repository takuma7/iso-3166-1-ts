# Repository consolidation

`takuma7/iso-3166-1-ts` is the canonical repository for the scraper, dataset, and
library. The two public npm package names and the `get-country-codes` CLI command
are preserved; the repository root is now a private pnpm workspace.

| Previous project | New location | Imported revision |
| --- | --- | --- |
| `takuma7/iso-3166-1-ts` | `packages/iso-3166-1-ts` | Main branch after PR #8 |
| `takuma7/get-country-codes` | `packages/get-country-codes` | `14bbf95eecfaecbcb73859f681004756ebd1d658` |
| `takuma7/iso-3166-1-csv` | `data` | `5a5de10bdc3407d2e4a76673155e8cc609a0fe3c` |

The scraper and CSV histories were imported with Git subtrees without squashing.
**Merge the consolidation PR with a merge commit** to keep those histories
reachable. Squash-merging or rebasing the PR would discard the imported ancestry.
Original license files are retained in both imported directories.

## Cutover

1. Merge the consolidation PR and confirm the Node.js 22/24 CI matrix passes.
2. Run the **Update country data** workflow manually to verify live ISO access
   and browser installation. CI uses local data, unit tests, and real Chrome
   fixtures; it does not query ISO.
3. Merge the legacy repository transition PRs. Disable the old scraper workflow
   that copies CSV into another repository, and point both old READMEs here.
4. Keep legacy repositories readable during the transition. Their existing raw
   CSV URLs remain historical snapshots; consumers should move to
   `https://raw.githubusercontent.com/takuma7/iso-3166-1-ts/main/data/iso-3166-1.csv`
   or pin a commit for reproducible data.
5. Release new npm versions from the package directories after reviewing the
   Node.js support change and the refreshed names. Repository migration itself
   does not publish a package.

The library generator reads the local CSV and validates required columns, code
formats, uniqueness, non-empty data, and the independent reviewed country-code
baseline before writing generated source. A refresh validates its candidate
before changing either artifact. Removing a baseline country requires an explicit
reviewed edit to `data/required-alpha2-codes.json`. CI
fails when that source and the CSV disagree. The imported snapshot updates three
country-name records (Bahamas, Netherlands, and Türkiye) from the older library
data. Exact-name lookups and name literal types reflect those changes.

The new monthly workflow proposes a single PR containing the CSV and generated
TypeScript. It uses the canonical repository's `GITHUB_TOKEN` with no cross-repo
secret. The repository must allow Actions-created pull requests. CI workflows
are explicitly dispatched on the update branch to avoid `GITHUB_TOKEN` event
suppression. The workflow does not merge or publish automatically.

Legacy repositories are not deleted or archived as part of this migration.

The live ISO probe during this change reached its security-verification page.
Current production DOM extraction remains unverified until live access succeeds.
The scraper detects blocking and fails without refreshing the checked-in data.
Do not retire the existing refresh process until the live cutover check passes.

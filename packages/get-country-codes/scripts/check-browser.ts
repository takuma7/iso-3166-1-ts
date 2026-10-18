import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { scrapePage } from '../src/scrape-page';

const records = [
  ['Afghanistan', "Afghanistan (l')", 'AF', 'AFG', '004'],
  ['Japan', 'Japon', 'JP', 'JPN', '392'],
  ['United States', 'États-Unis', 'US', 'USA', '840'],
  ['Canada', 'Canada', 'CA', 'CAN', '124'],
];

// Model asynchronous ISO search, a changed generated radio ID and option values,
// reordered columns, an unrelated table, and multiple result pages.
const fixture = (mode: string) => `<!doctype html><title>Country search</title>
<input type="radio" id="new-generated-id"><label for="new-generated-id">Country codes</label>
<button id="search">Search</button><div id="results"></div>
<script>
const rows = ${JSON.stringify(records)};
const mode = ${JSON.stringify(mode)};
let offset = 0, size = 1;
function render() {
 const data = rows.slice(offset, offset + size).map(row => [...row]);
 if (mode === 'duplicate' && offset) data[0] = rows[0];
 if (mode === 'numeric') data[0][4] = '4';
 document.getElementById('results').innerHTML =
 '<table><thead><tr><th>Unrelated</th></tr></thead><tbody><tr><td>Ignore me</td></tr></tbody></table>' +
 (mode === 'missing-count' ? '' : '<p>' + (offset + 1) + '–' + (offset + data.length) + ' of ' + rows.length + '</p>') +
 '<select aria-label="Results per page"><option value="small" ' + (size === 1 ? 'selected' : '') + '>1 result</option><option value="large-changed" ' + (size === 3 ? 'selected' : '') + '>3 results</option></select>' +
 '<table><thead><tr><th>Alpha-2 code</th><th>English short name</th><th>Numeric</th><th>Extra</th><th>French short name</th><th>Alpha-3 code</th></tr></thead><tbody>' +
 data.map(row => '<tr>' + [row[2], row[0], row[4], 'ignored', row[1], row[3]].map(cell => '<td>' + cell + '</td>').join('') + '</tr>').join('') +
 '</tbody></table><button aria-label="Next page" ' + (mode === 'no-next' || offset + size >= rows.length ? 'disabled' : '') + '>Next</button>';
 document.querySelector('select').onchange = event => {
  size = event.target.value === 'large-changed' ? 3 : 1;
  setTimeout(render, 150);
 };
 document.querySelector('[aria-label="Next page"]').onclick = () => {
  if (mode === 'stuck') return;
  offset += size; setTimeout(render, 150);
 };
}
document.getElementById('search').onclick = () => {
 if (!document.getElementById('new-generated-id').checked) throw Error('Country codes not selected');
 setTimeout(render, 150);
};
</script>`;

async function main() {
  const browser = await puppeteer.launch();
  let passed = 0;
  try {
    for (const [mode, expected] of [
      ['complete', null], ['duplicate', /duplicate country code/],
      ['numeric', /malformed country row/], ['no-next', /no next page/],
      ['stuck', /Timed out/], ['missing-count', /Timed out/],
      ['blocked', /security verification/],
    ] as const) {
      const page = await browser.newPage();
      try {
        await page.setContent(mode === 'blocked' ? '<title>Just a moment...</title><p>Verify you are human</p>' : fixture(mode));
        if (expected) await assert.rejects(scrapePage(page, { timeoutMs: 2_000 }), expected);
        else assert.deepEqual((await scrapePage(page, { timeoutMs: 5_000 })).rows, records);
        console.log(`PASS browser fixture: ${mode}`);
        passed++;
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`${passed} Chrome fixture checks passed.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });

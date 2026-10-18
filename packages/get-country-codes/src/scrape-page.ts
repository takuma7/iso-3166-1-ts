import type { Page } from 'puppeteer';

export interface CountryTable {
  headers: string[];
  rows: string[][];
}

interface PageSnapshot {
  blocked: boolean;
  table: CountryTable | null;
  total: number | null;
  start: number | null;
  end: number | null;
  pageSize: { index: number; value: string; size: number; selected: boolean } | null;
  error: string | null;
}

// Passed to page.evaluate: keep this function independent of module state.
export function readCountryPage(): PageSnapshot {
  const text = document.body.innerText;
  const blocked = /just a moment|verify you are human|performing security verification|access denied/i.test(document.title + '\n' + text);
  const required = ['English short name', 'French short name', 'Alpha-2 code', 'Alpha-3 code', 'Numeric'];
  let table: CountryTable | null = null;
  for (const element of document.querySelectorAll('table')) {
    const headers = Array.from(element.querySelectorAll('thead th')).map(th => (th.textContent || '').replace(/\s+/g, ' ').trim());
    const indices = required.map(header => headers.findIndex(value => value.toLowerCase() === header.toLowerCase()));
    if (indices.some(index => index < 0)) continue;
    table = {
      headers: required,
      rows: Array.from(element.querySelectorAll('tbody tr'))
        .map(tr => Array.from(tr.querySelectorAll('td')).map(td => (td.textContent || '').replace(/\s+/g, ' ').trim()))
        .filter(row => row.length === headers.length)
        .map(row => indices.map(index => row[index])),
    };
    break;
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const metadataParts: string[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement?.closest('select, script, style, table, [hidden]') &&
        node.parentElement?.checkVisibility()) metadataParts.push(node.textContent || '');
  }
  const metadata = metadataParts.join(' ');
  const range = metadata.match(/\b(\d+)\s*[-–]\s*(\d+)\s+(?:of|\/)\s*(\d+)\b/i);
  const totals = new Set<number>();
  if (range) totals.add(Number(range[3]));
  for (const pattern of [
    /\b(?:search\s+)?results?\s*[:(]\s*(\d+)\b/gi,
    /\b(\d+)\s+results?\b(?!\s+per\s+page)/gi,
    /\btotal\s*:\s*(\d+)\b/gi,
  ]) {
    for (const match of metadata.matchAll(pattern)) totals.add(Number(match[1]));
  }
  let pageSize: PageSnapshot['pageSize'] = null;
  Array.from(document.querySelectorAll('select')).forEach((select, index) => {
    if (select.options.length < 2) return;
    for (const option of select.options) {
      const label = option.textContent?.trim() || '';
      const size = /^all$/i.test(label) ? Number.MAX_SAFE_INTEGER : /^\d+(?:\s+(?:results?|rows?))?$/i.test(label) ? Number.parseInt(label, 10) : 0;
      if (size > 0 && !option.disabled && (!pageSize || size > pageSize.size)) {
        pageSize = { index, value: option.value, size, selected: option.selected };
      }
    }
  });
  return {
    blocked, table, total: totals.size === 1 ? [...totals][0] : null,
    start: range ? Number(range[1]) : null, end: range ? Number(range[2]) : null,
    pageSize, error: totals.size > 1 ? 'Conflicting country result counts on ISO page' : null,
  };
}

export function validateCountryTable(table: CountryTable): void {
  if (!table.rows.length) throw new Error('ISO returned an empty country table');
  const seen = [new Set<string>(), new Set<string>(), new Set<string>()];
  for (const row of table.rows) {
    if (row.length !== 5 || !row[0]?.trim() || !row[1]?.trim() ||
        !/^[A-Z]{2}$/.test(row[2]) || !/^[A-Z]{3}$/.test(row[3]) || !/^\d{3}$/.test(row[4])) {
      throw new Error('ISO returned a malformed country row');
    }
    for (let index = 0; index < 3; index++) {
      const code = row[index + 2];
      if (seen[index].has(code)) throw new Error(`ISO returned duplicate country code ${code}`);
      seen[index].add(code);
    }
  }
}

export async function scrapePage(page: Page, { timeoutMs = 60_000 } = {}): Promise<CountryTable> {
  const deadline = Date.now() + timeoutMs;
  const waitFor = async (ready: (snapshot: PageSnapshot) => boolean): Promise<PageSnapshot> => {
    while (Date.now() < deadline) {
      const snapshot = await page.evaluate(readCountryPage);
      if (snapshot.blocked) throw new Error('ISO access is blocked by a security verification page; no country data was extracted.');
      if (snapshot.error) throw new Error(snapshot.error);
      if (ready(snapshot)) return snapshot;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timed out waiting for complete ISO country results; no country data was extracted.');
  };

  const waitForAction = async (action: () => boolean): Promise<void> => {
    while (Date.now() < deadline) {
      await waitFor(() => true);
      if (await page.evaluate(action)) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timed out waiting for ISO country search controls');
  };

  // Locate the radio by its visible label, rather than a generated GWT ID.
  await waitForAction(() => {
    for (const label of document.querySelectorAll('label')) {
      if (!/^country codes$/i.test((label.textContent || '').replace(/\s+/g, ' ').trim())) continue;
      const control = label.control || label.parentElement?.querySelector('input[type=radio]');
      if (control instanceof HTMLInputElement && control.type === 'radio') {
        control.click();
        return true;
      }
    }
    return false;
  });
  await waitForAction(() => {
    const button = Array.from(document.querySelectorAll<HTMLElement>('button, input[type=submit], [role=button], .go'))
      .find(element => /^search$/i.test((element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim()) || element.classList.contains('go'));
    if (!button) return false;
    button.click();
    return true;
  });

  let snapshot = await waitFor(state => Boolean(state.table?.rows.length && state.total !== null));
  const total = snapshot.total!;
  if (snapshot.start !== null && snapshot.start !== 1) throw new Error('ISO search did not start on the first results page');
  const choice = snapshot.pageSize;
  let size = choice?.size || (snapshot.end !== null ? snapshot.end : 0);
  if (snapshot.table!.rows.length === total) size = total;
  if (!size) throw new Error('Cannot determine ISO result page size; refusing a possibly partial table');
  if (choice && !choice.selected && snapshot.table!.rows.length < total) {
    await page.evaluate(({ index, value }) => {
      const select = document.querySelectorAll('select')[index];
      select.value = value;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, choice);
  }
  snapshot = await waitFor(state => state.total === total && state.table?.rows.length === Math.min(size, total));
  const rows: string[][] = [];
  while (true) {
    const current = snapshot.table!;
    validateCountryTable(current);
    rows.push(...current.rows);
    validateCountryTable({ headers: current.headers, rows });
    if (rows.length === total) return { headers: current.headers, rows };
    if (rows.length > total) throw new Error('ISO country rows exceed the reported result count');
    const previous = JSON.stringify(current.rows);
    const advanced = await page.evaluate(() => {
      const next = Array.from(document.querySelectorAll<HTMLElement>('button, a, [role=button]'))
        .find(element => /^(?:next(?: page)?|›|>)$/i.test((element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim()));
      if (!next || next.hasAttribute('disabled') || next.getAttribute('aria-disabled') === 'true' || /disabled/.test(next.className)) return false;
      next.click();
      return true;
    });
    if (!advanced) throw new Error(`Incomplete ISO results: extracted ${rows.length} of ${total}, but no next page is available`);
    snapshot = await waitFor(state => state.total === total && Boolean(state.table) &&
      JSON.stringify(state.table!.rows) !== previous && state.table!.rows.length === Math.min(size, total - rows.length) &&
      (state.start === null || state.start === rows.length + 1));
  }
}

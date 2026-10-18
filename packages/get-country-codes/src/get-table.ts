import puppeteer from 'puppeteer';

import { run } from './run';
import { scrapePage } from './scrape-page';

export const getTable = async () => {
  const browser = await run('Launch browser', puppeteer.launch({
    defaultViewport: { width: 1200, height: 1000 },
  }));
  try {
    const page = await browser.newPage();
    const response = await run('Load ISO page', page.goto('https://www.iso.org/obp/ui/#search', {
      waitUntil: 'domcontentloaded', timeout: 60_000,
    }));
    if (response && response.status() >= 400) {
      throw new Error(`ISO returned HTTP ${response.status()}; automated access may be blocked. No country data was extracted.`);
    }
    return await run('Extract complete country table', scrapePage(page));
  } finally {
    await browser.close();
  }
};

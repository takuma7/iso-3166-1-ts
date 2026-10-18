import { afterEach, expect, test, vi } from 'vitest';
import puppeteer from 'puppeteer';
import { getTable } from './get-table';
import { scrapePage } from './scrape-page';

vi.mock('puppeteer', () => ({ default: { launch: vi.fn() } }));
vi.mock('./run', () => ({ run: (_text: string, promise: Promise<unknown>) => promise }));
vi.mock('./scrape-page', () => ({ scrapePage: vi.fn() }));
afterEach(() => vi.resetAllMocks());

const setupBrowser = () => {
  const table = { headers: ['Numeric'], rows: [['004']] };
  const page = { goto: vi.fn().mockResolvedValue({ status: () => 200 }) };
  const browser = { newPage: vi.fn().mockResolvedValue(page), close: vi.fn().mockResolvedValue(undefined) };
  vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);
  vi.mocked(scrapePage).mockResolvedValue(table);
  return { table, page, browser };
};

test('extracts results and closes the browser without leaking signal handlers', async () => {
  const { table, page, browser } = setupBrowser();
  const listeners = process.listenerCount('SIGINT');
  expect(await getTable()).toEqual(table);
  expect(scrapePage).toHaveBeenCalledWith(page);
  expect(browser.close).toHaveBeenCalledOnce();
  expect(process.listenerCount('SIGINT')).toBe(listeners);
});

test.each(['navigation', 'extraction', 'newPage', 'HTTP'])('closes the browser on %s failure', async failure => {
  const { page, browser } = setupBrowser();
  if (failure === 'navigation') page.goto.mockRejectedValue(new Error('failed navigation'));
  if (failure === 'extraction') vi.mocked(scrapePage).mockRejectedValue(new Error('failed extraction'));
  if (failure === 'newPage') browser.newPage.mockRejectedValue(new Error('failed newPage'));
  if (failure === 'HTTP') page.goto.mockResolvedValue({ status: () => 403 });
  await expect(getTable()).rejects.toThrow(failure === 'HTTP' ? 'HTTP 403' : `failed ${failure}`);
  expect(browser.close).toHaveBeenCalledOnce();
});

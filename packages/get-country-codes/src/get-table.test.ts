import { afterEach, expect, test, vi } from 'vitest';
import puppeteer from 'puppeteer';
import { getTable } from './get-table';

vi.mock('puppeteer', () => ({ default: { launch: vi.fn() } }));
vi.mock('./run', () => ({ run: (_text: string, promise: Promise<unknown>) => promise }));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

const setupBrowser = () => {
  const headers = ['English short name', 'French short name', 'Alpha-2 code', 'Alpha-3 code', 'Numeric'];
  const rows = [['Afghanistan', "Afghanistan (l')", 'AF', 'AFG', '004']];
  const page = {
    setUserAgent: vi.fn().mockResolvedValue(undefined),
    goto: vi.fn().mockResolvedValue(undefined),
    waitForSelector: vi.fn().mockResolvedValue(undefined),
    click: vi.fn().mockResolvedValue(undefined),
    select: vi.fn().mockResolvedValue(undefined),
    $: vi.fn().mockResolvedValue({ $$eval: vi.fn()
      .mockResolvedValueOnce(headers).mockResolvedValueOnce(rows) }),
  };
  const browser = { newPage: vi.fn().mockResolvedValue(page), close: vi.fn().mockResolvedValue(undefined) };
  vi.mocked(puppeteer.launch).mockResolvedValue(browser as never);
  return { headers, rows, page, browser };
};

test('returns the scraped table and closes its browser without leaking signal handlers', async () => {
  vi.useFakeTimers();
  const { headers, rows, browser } = setupBrowser();
  const listeners = process.listenerCount('SIGINT');
  const result = getTable();
  await vi.runAllTimersAsync();
  expect(await result).toEqual({ headers, rows });
  expect(browser.close).toHaveBeenCalledOnce();
  expect(process.listenerCount('SIGINT')).toBe(listeners);
});

test('closes the browser and removes its signal handler when navigation fails', async () => {
  const { page, browser } = setupBrowser();
  page.goto.mockRejectedValue(new Error('Navigation failed'));
  const listeners = process.listenerCount('SIGINT');
  await expect(getTable()).rejects.toThrow('Navigation failed');
  expect(browser.close).toHaveBeenCalledOnce();
  expect(process.listenerCount('SIGINT')).toBe(listeners);
});

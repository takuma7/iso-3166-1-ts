import puppeteer from 'puppeteer'
import UserAgent from 'user-agents'

import { run } from './run'

const TABLE_SELECTOR = 'div.v-grid-tablewrapper table'

export const getTable = async () => {
  const browser = await run(
    'Launch browser',
    puppeteer.launch({
      defaultViewport: { width: 1200, height: 1000 },
    })
  )

  process.on('SIGINT', async () => {
    console.log('\nCtrl+C detected. Closing browser...')
    if (browser) {
      await browser.close()
    }
    process.exit()
  })

  try {
    const page = await run(
      'Load page',
      (async () => {
        const p = await browser.newPage()
        // setting UA to bypass "Verify you are human by completing the action below."
        p.setUserAgent(new UserAgent().random().toString())
        await p.goto('https://www.iso.org/obp/ui/#search', {
          waitUntil: 'networkidle2',
        })
        return p
      })()
    )

    await run(
      'Wait for the country codes radio button to appear',
      (async () => {
        await page.waitForSelector('#gwt-uid-12')
      })()
    )

    await run(
      'Navigate to the country codes page',
      (async () => {
        // Select "Country codes"
        await page.click('#gwt-uid-12')

        // Hit the search button
        await page.click('div.go')

        await page.waitForSelector(TABLE_SELECTOR)
      })()
    )

    // Assuming the number of countries is never going to exceed 300,
    // changing the number of rows to 300 to extract data at once.
    await run(
      'Change "the results per page" to 300',
      (async () => {
        await page.select('select.v-select-select', '8')
        // Wait for 5 secs to let the page load
        await new Promise((resolve) => setTimeout(resolve, 5000))
        await page.waitForSelector(TABLE_SELECTOR)
      })()
    )

    const { headers, rows } = await run(
      'Extract country codes',
      (async () => {
        const table = await page.$(TABLE_SELECTOR)
        if (!table) {
          throw new Error(`Table couldn't be found at ${TABLE_SELECTOR}`)
        }
        return {
          headers: await table.$$eval('thead th', (ths) =>
            ths.map((th) => th.textContent ?? '')
          ),
          rows: await table.$$eval('tbody tr', (trs) =>
            trs.map((tr) =>
              Array.from(tr.querySelectorAll('td')).map(
                (td) => td.textContent ?? ''
              )
            )
          ),
        }
      })(),
      {
        succeedText: ({ result, text }) => {
          const { rows } = result
          return `${text}... Found ${rows.length} country codes`
        },
      }
    )
    return { headers, rows }
  } finally {
    await browser.close()
  }
}

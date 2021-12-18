const puppeteer = require('puppeteer');

const pageNumber = 1;
const baseUrl = 'https://www.leafly.com/strains?page=';

(async () => {
  const url = `${baseUrl}${pageNumber}`;
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const confirmAgeBtn = await page.$('[data-testid=age-gate-yes-button]');
  await confirmAgeBtn.click();

  const response = await page.waitForResponse(res => {
    return res.url().startsWith('https://consumer-api.leafly.com/api/strain_playlists/v2') && res.status() === 200;
  });

  console.log(await response.json());
  await browser.close();
})();
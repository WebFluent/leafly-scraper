const puppeteer = require('puppeteer');
const { writeFile, readFile, } = require('fs/promises');

const maxPageNumber = 325;
const baseUrl = 'https://www.leafly.com/strains?page=';
const strainsFile = 'strains.json';
let pageNumber = 0;

const goToNextPage = (page) => {
  pageNumber = pageNumber + 1;
  console.log(`page ${pageNumber}/${maxPageNumber}`);
  return page.goto(`${baseUrl}${pageNumber}`);
};

const getPageStrains = (page) => page.waitForResponse(async (res) => {
  return res.url().startsWith('https://consumer-api.leafly.com/api/strain_playlists/v2') && res.status() === 200;
}, { timeout: 10000 });

const mergeData = async (data) => {
  const readStrains = await readFile(strainsFile, { encoding: 'utf-8' });
  return [...JSON.parse(readStrains), ...data.hits.strain]
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await goToNextPage(page);

  const confirmAgeBtn = await page.$('[data-testid=age-gate-yes-button]');
  await confirmAgeBtn.click();

  for (let i = 0; i < maxPageNumber; i++) {
    const response = await getPageStrains(page);
    const data = await response.json();
    const dataToWrite = await mergeData(data);

    await writeFile(strainsFile, JSON.stringify(dataToWrite), 'utf-8');
    await goToNextPage(page);
  }

  await browser.close();
})();
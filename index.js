const puppeteer = require('puppeteer');
const {writeFile, appendFile, readFile} = require("fs/promises")
const pageNumber = 1;
const baseUrl = 'https://www.leafly.com/strains?page=';

(async () => {
  const url = `${baseUrl}${pageNumber}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const confirmAgeBtn = await page.$('[data-testid=age-gate-yes-button]');
  await confirmAgeBtn.click();

  for (let i = 0; i < 325; i++) {
    const response = await page.waitForResponse(res => {
      return res.url().startsWith('https://consumer-api.leafly.com/api/strain_playlists/v2') && res.status() === 200;
    });

    const data = await response.json()

    const readStrains = await readFile("strains.json", {encoding: "utf-8"});

    const dataToWrite = [...JSON.parse(readStrains), ...data.hits.strain]
  
    await writeFile("strains.json", JSON.stringify(dataToWrite), "utf-8");
  
    const nextBtn = await page.$('[data-testid=next]')
  
    await nextBtn.click()    
  }
  


  await browser.close();
})();
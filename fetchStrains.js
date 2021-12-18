const axios = require('axios').default;
const fs = require('fs');

const exportFileName = 'fetched-strains.json';
const basePath = 'https://consumer-api.leafly.com/api/strain_playlists/v2';
const totalStrainCount = 5834; // total strain count in leafly
const take = 60; // max is 60
let skip = 0;
let strainsArr = [];

(async () => {
  while (skip < totalStrainCount) {
    console.log(`Requesting strains ${skip} - ${skip + take}...`);
    const { data } = await axios.get(`${basePath}?&skip=${skip}&take=${take}&lat=33.4656&lon=-111.9956`);
    const { strain } = data.hits;
    console.log('Success!!');
    strainsArr.push(...strain);
    skip = skip + take;
  }
  console.log(`Successfully fetched ${strainsArr.length} strains!!`);
  console.log(`Writing data to ${exportFileName}...`);
  fs.writeFileSync(exportFileName, JSON.stringify(strainsArr));
  console.log('Complete :)');
})();

const { readFile, writeFile } = require("fs/promises");

// ONLY TESTED ON FLOWER PRODUCTS

(async () => {
  let brands = [],
    strains = [],
    dispensaries = [],
    products = [];

  const data = JSON.parse(await readFile("products.json", "utf-8"));

  data.forEach((product) => {
    const { strain, brand, bestOfferVariant, ...rest } = product;

    products.push(rest);
    dispensaries.push(bestOfferVariant?.dispensary);
    strains.push(strain);
    brands.push(brand);
  });

  await Promise.all(
    Object.entries({ brands, strains2: strains, dispensaries, products }).map(
      ([key, val]) => {
        writeFile(`./data/filtered/${key}.json`, JSON.stringify(val), "utf-8", );
      }
    )
  );
})();

const axios = require("axios");
const route = "products";
const category = "";
const subcategory = "solventless";
const { writeFile } = require("fs/promises");

const subcategories = ["flower", "solvent", "solventless"];
const strain_categories = ["Indica", "Sativa"];

(async () => {
  let products = [];
  const pages = 60;
  const skip = 60;

  for (let i = 0; i < pages; i++) {
    try {
      const endpoint = `https://consumer-api.leafly.com/api/${route}/v2/search?${
        category ? `filter[category]=${category}&` : ""
      }filter[subcategory]=${subcategory}&lat=33.3931&lon=-111.5768&skip=${
        (i) * skip
      }&sort[0][recommended]=desc&take=60`;

      process.stdout.write(`Page: ${i + 1}/ ${pages}\r`);

      const {
        data: { data },
      } = await axios.get(endpoint);

      products = [...products, ...data];
    } catch (error) {
      console.log({ error });
      break;
    }
  }

  console.log("Total: ", products.length);

  await writeFile(`${subcategory}.json`, JSON.stringify(products), "utf-8");
})();

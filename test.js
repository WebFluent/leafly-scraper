const {writeFile, appendFile, readFile} = require("fs/promises");

(async () => {
  await readFile("strains.json")
})()
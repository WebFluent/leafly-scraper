const fs = require('fs');
const strains = require('./strains.json');
const { v4: uuidv4 } = require('uuid');

let newArr = [];
for (const strain of strains) {
  const { name, category, nugImage } = strain;
  newArr.push({ id: uuidv4(), name, type: category, imgURL: nugImage })
}

fs.writeFileSync('extracted-strains.json', JSON.stringify(newArr));

const xlsx2json = require('xlsx2json');
const fs = require('fs');

if (fs.existsSync('./cpcdi/.DS_Store')) {
  fs.unlink('./cpcdi/.DS_Store');
}

const fileMap = fs.readdirSync('./cpcdi')
  .filter(file => file.indexOf('~lock') === -1);

const options = {
  dataStartingRow: 2,
  sheet: 0,
  mapping: {
    reference: 'A',
    title: 'B',
    brand: 'C',
    category: 'D',
    subCategory: 'E',
    ecovalor: 'F',
    ecoreee: 'G',
    authorRights: 'H',
    price: 'I',
    price30days: 'J',
    stock: 'K',
  }
};

const importPromises = [];

fileMap.forEach((input) => {
  importPromises.push(xlsx2json(`./cpcdi/${input}`, options));
});


Promise.all(importPromises)
.then(promises => {
  const statistics = {
    inputFiles: promises.length
  };
  const jsonArray = promises.reduce((a, b) => [...a, ...b]);

  statistics.products = jsonArray.length;

  console.log(statistics);
  const result = jsonArray.map((row) => {
    const {
      reference,
      title,
      brand,
      category,
      subCategory,
      ecovalor,
      ecoreee,
      authorRights,
      price,
      price30days,
      stock
    } = row;

    return stock !== 'Em stock - Lisboa' && {
        reference,
        title,
        brand,
        category,
        subCategory,
        costPricePP: Number(ecovalor) + Number(ecoreee) + Number(authorRights) + Number(price),
        costPrice30Days: Number(ecovalor) + Number(ecoreee) + Number(authorRights) + Number(price30days),
        stock,
      };
  });

  fs.writeFile(`./json/produtos.json`, JSON.stringify(result));
})
  .catch(console.error);
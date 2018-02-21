const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
require('./nightmare-login-cpcdi')(nightmare); // Login na CPCDI

const results = [];
const urls = ['80TR002YPG', '1ME42AA', 'UM.WV6EE.B04', 'HX316C10F/8'];
let currentIndex = 0;


const fetchProductInfo = (index) => {
  nightmare
    .wait(1000)
    .goto(`https://cpcdi.pt/Produtos/Referencia?referencia=${urls[index]}`)
    .wait('h2.header-text')
    .click('#img_grande .img-responsive')
    .wait(500)
    .evaluate(() => ({
      imgUrl: document.querySelector('img.lb-image').src,
      tableProduct: document.querySelector('#tabelaFicha') ? document.querySelector('#tabelaFicha').outerHTML : ''
    }))
    .then((result) => {
      results.push(result);
      if (currentIndex < urls.length) {
        fetchProductInfo(currentIndex++);
      } else {
        console.log('FINISHED!');
        console.log(results);
        return nightmare.end();
      }
    });
};

fetchProductInfo(currentIndex);


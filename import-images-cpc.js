const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const mongoose = require('mongoose');

const ProductSchema = require('./product.schema');

const Product = mongoose.model('product', ProductSchema);
const uri = process.env.MONGO_URI;

const mongo = mongoose.connect(uri, {useMongoClient: true});

require('./nightmare-login-cpcdi')(nightmare).then(() => {
  mongoose.Promise = Promise;

  let queryObj = {
    $and: [
      {imgUrl: {$exists: false}},
      {noInfoOnCPCDI: {$exists: false}}
    ]
  };

  let currentIndex = 0;

  Product.find(queryObj)
    .then((products) => {
      const fetchProductInfo = (index) => {
        const product = products[index];
        nightmare
          .wait(1500)
          .goto(`https://cpcdi.pt/Produtos/Referencia?referencia=${product.reference}`)
          .wait('h2.header-text')
          .click('#img_grande .img-responsive')
          .wait(1000)
          .evaluate(() => ({
            imgUrl: document.querySelector('img.lb-image').src,
            tableProduct: document.querySelector('#tabelaFicha') ? document.querySelector('#tabelaFicha').outerHTML : ''
          }))
          .then((result) => {
            Product.findById(product._id)
              .then((product) => {
                product.imgUrl = result.imgUrl;
                product.specifications = result.tableProduct;
                product.noInfoOnCPCDI = false;
                product.modifiedOn = Date.now();

                console.log(product);
                product.save()
                  .then(newProduct => {
                    if (currentIndex < products.length) {
                      fetchProductInfo(currentIndex++);
                    } else {
                      console.log('FINISHED!');
                      return nightmare.end();
                    }
                  })
                  .catch(console.error);
              });
          })
          .catch((result) => {
            Product.findById(product._id)
              .then((product) => {
                product.noInfoOnCPCDI = true;
                product.modifiedOn = Date.now();

                console.log(product);
                product.save()
                  .then(newProduct => {
                    if (currentIndex < products.length) {
                      fetchProductInfo(currentIndex++);
                    } else {
                      console.log('FINISHED!');
                      return nightmare.end();
                    }
                  })
                  .catch(console.error);
              });
          });
      };

      fetchProductInfo(currentIndex);
    })
    .catch(console.error);


});


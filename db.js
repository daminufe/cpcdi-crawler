const mongoose = require('mongoose');
mongoose.Promise = Promise;

const data = require('./json/produtos.json');

const uri = process.env.MONGO_URI;

const mongo = mongoose.connect(uri, {useMongoClient: true});

const ProductSchema = require('./product.schema');

const Product = mongoose.model('product', ProductSchema);

mongo.then((db) => {
  Product.insertMany(data, {ordered: false})
    .then((result) => {
      console.log(`Inserted ${result.length} products`);
      db.close();
    })
    .catch(console.error);
});

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  createdOn: { type: Date, default: Date.now },
  modifiedOn: { type: Date },
  reference: { type: String, index: {unique: true}},
  title: String,
  description: String,
  brand: String,
  category: String,
  subCategory: String,
  costPricePP: Number,
  costPrice30Days: Number,
  stock: String,
  previousData: [mongoose.Schema.Types.Mixed],
  specifications: String,
  imgUrl: String,
  noInfoOnCPCDI: Boolean,
  user: String,
  star: Boolean
});

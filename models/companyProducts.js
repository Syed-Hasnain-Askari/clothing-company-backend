var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var companyProducts = new mongoose.Schema({
  products: {
    type: [
      {
        productName: String,
        productSize: String,
        productImage: String,
        productPrice: Number,
      },
    ],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },
});
module.exports = new mongoose.model("companyProducts", companyProducts);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeProducts = new mongoose.Schema({
      products: {
        type: [{
          productName: String,
          productSize: String,
          productImage: String,
          productPrice: Number,
          productQuantity:Number
        }],
        required: true
      },
      companyId: {
        type: Schema.Types.ObjectId,
        ref: 'company'
      },
});
module.exports = new mongoose.model('employeeProducts', employeeProducts);
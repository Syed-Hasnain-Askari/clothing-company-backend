var mongoose = require('mongoose');
var employeeProducts = new mongoose.Schema({
      products: {
        type: [{
          productName: String,
          productSize: String,
          productImage: String,
          productPrice: Number
        }],
        required: true
      }
});
module.exports = new mongoose.model('employeeProducts', employeeProducts);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employeeProducts = new mongoose.Schema({
      products: {
        type: [{
          productName: String,
          productSize: String,
          productImage: String,
          productPrice: Number
        }],
        required: true
      },
      employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
      },
});
module.exports = new mongoose.model('employeeProducts', employeeProducts);
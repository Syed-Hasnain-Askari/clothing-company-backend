var mongoose = require('mongoose');
var employeeProducts = new mongoose.Schema({
      products: {
        type: [{
          productName: String,
          productSize: String,
          productImage: String,
          productPrice: String
        }],
        required: true
      },
      companyName:{
        type:String,
        required:true
      },
});
module.exports = new mongoose.model('employeeProducts', employeeProducts);
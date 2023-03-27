var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orders = new mongoose.Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
      },
      products: {
        type: [{
          _id: false,
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
module.exports = new mongoose.model('oders', orders);
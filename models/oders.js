var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orders = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employee'
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'company'
  },
  products: {
    type: [{
      _id: false,
      productName: String,
      productSize: String,
      productImage: String,
      productPrice: Number
    }],
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  bill: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});
module.exports = new mongoose.model('oders', orders);
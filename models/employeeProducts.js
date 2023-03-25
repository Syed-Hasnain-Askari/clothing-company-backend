var mongoose = require('mongoose');
var employeeProducts = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        enum: ['M', 'F'],
        required: true
      },
      products: {
        type: [{
          productName: String,
          productSize: String
        }],
        required: true
      },
      employeeEmail:{
        type:String,
        required:true
      },
      companyName:{
        type:String,
        required:true
      },
});
module.exports = new mongoose.model('employeeProducts', employeeProducts);
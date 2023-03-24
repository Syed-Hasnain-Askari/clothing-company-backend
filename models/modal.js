var mongoose = require('mongoose');
var user = new mongoose.Schema({
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
      }
});
module.exports = new mongoose.model('user', user);
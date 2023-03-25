var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var employee = new mongoose.Schema({
  productsId: {
    type: Schema.Types.ObjectId,
    ref: 'employeeProducts'
  },
  employeeName: {
    type: String,
    required: true
  },
  employeePassword: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true
  },
  employeeEmail: {
    type: String,
    required: true
  }
});
module.exports = new mongoose.model('employee', employee);
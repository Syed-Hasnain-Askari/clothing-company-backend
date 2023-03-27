var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const company = new mongoose.Schema({
    name: { type: String, required: true },
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
  });
module.exports = new mongoose.model('company', company);
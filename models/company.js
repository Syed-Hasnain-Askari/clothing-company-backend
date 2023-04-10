var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const company = new mongoose.Schema({
  companyName: { type: String },
  companyEmail: { type: String },
  companyPhone: { type: String },
  companyFax: { type: String },
  companyLogo: { type: String },
  // employees: [{ type: Schema.Types.ObjectId, ref: 'employee' }],
});
module.exports = new mongoose.model('company', company);
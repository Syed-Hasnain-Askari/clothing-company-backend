const mongoose = require('mongoose');
const Modal = mongoose.model;
const company = new mongoose.Schema({
  companyName: { type: String },
  companyEmail: { type: String },
  companyPhone: { type: String },
  companyFax: { type: String },
  companyLogo: { type: String }
});
module.exports = new Modal('company', company);

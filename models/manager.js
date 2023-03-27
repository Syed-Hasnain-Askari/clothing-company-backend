var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const manager = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
});
module.exports = new mongoose.model('manager', manager);
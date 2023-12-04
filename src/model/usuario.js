var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = Schema({
  nombre: { type: String, required: true },
});
module.exports = mongoose.model('Usuario', schema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthStrategySchema = new Schema({
  id: String,
  key: String,
  name: String,
  display: String
});

var AuthStrategyModel = mongoose.model('Strategy', AuthStrategySchema);
exports.Strategy = AuthStrategyModel;

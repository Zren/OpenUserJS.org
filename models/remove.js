var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var RemovedItemSchema = new Schema({
  model: String,
  content: Schema.Types.Mixed,
  removed: {type: Date, default: Date.now},
  reason: String,
  removerName: String,
  removerRole: Number,
  _removerId: {type: ObjectId, reg: 'User'}
});

var RemovedItemModel = mongoose.model('Remove', RemovedItemSchema);
exports.Remove = RemovedItemModel;

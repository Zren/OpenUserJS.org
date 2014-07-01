var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var FlagSchema = new Schema({
  model: String,
  _contentId: ObjectId,
  _userId: {type: ObjectId, ref: 'User'}
});

var FlagModel = mongoose.model('Flag', FlagSchema);
exports.Flag = FlagModel;

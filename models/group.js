var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ScriptGroupSchema = new Schema({
  //--- Data
  name: String,
  // created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  _scriptIds: [{type: ObjectId, reg: 'Script'}],

  //--- Generated
  // scriptCount: {type: Number, default: 0},
  rating: {type: Number, default: 0}, // collectiveRating([Script, ...])
});
ScriptGroupSchema.plugin(require('./mixins/moderated'));

var ScriptGroupModel = mongoose.model('Group', ScriptGroupSchema);
exports.Group = ScriptGroupModel;

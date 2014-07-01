var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// clean the name of the group so it is url safe
function cleanGroupName(name) {
  return cleanFilename(name, '').replace(/_/g, ' ')
    .replace(/^\s+|\s+$/g, '').replace(/,/g, '');
}

var ScriptGroupSchema = new Schema({
  //--- Data
  name: {type: String, set: cleanGroupName},
  // created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  _scriptIds: [{type: ObjectId, ref: 'Script'}],

  //--- Generated
  // scriptCount: {type: Number, default: 0},
  rating: {type: Number, default: 0}, // collectiveRating([Script, ...])
});
ScriptGroupSchema.plugin(require('./mixins/moderated'));

ScriptGroupSchema.methods.addScript = function(script, cb) {
  this.update({
    $addToSet: { _scriptIds: script._id }
  }, cb);
};

ScriptGroupSchema.methods.removeScript = function(script, cb) {
  this.update({
    $pull: { _scriptIds: script._id }
  }, cb);
};

ScriptGroupSchema.statics.removeScriptFromAllGroups = function(script, cb) {
  this.model('Group').update({
    $pull: { _scriptIds: script._id }
  }, cb);
};

var ScriptGroupModel = mongoose.model('Group', ScriptGroupSchema);
exports.Group = ScriptGroupModel;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ScriptSchema = new Schema({
  //--- Data
  name: String,
  author: String,
  _authorId: {type: ObjectId, ref: 'User'},
  about: String,
  // created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  uses: [String],
  // libraries: [{type: ObjectId, reg: 'Script'}],
  fork: Array, // [{ "url": "Author/ScriptName", "author": "Author" }, ...]
  // forkParent: {type: ObjectId, reg: 'Script'},
  isLib: Boolean,
  meta: Object,

  //--- Generated
  installName: String,
  installs: Number,
  rating: Number,
  votes: Number, // upvotes negate flags
  // upvoteCount: {type: Number, default: 0},
  // downvoteCount: {type: Number, default: 0},

  //---
  _groupId: {type: ObjectId, ref: 'Group'}, // The group is script created
});
ScriptSchema.plugin(require('./mixins/moderated'));

ScriptSchema.methods.getGroups = function(cb) {
  this.model('Group').find({
    _scriptIds: this._id
  }, cb);
};

ScriptSchema.methods.getLibraries = function(cb) {
  this.model('Script').find({
    installName: { $in: this.uses }
  }, cb);
};

var ScriptModel = mongoose.model('Script', ScriptSchema);
exports.Script = ScriptModel;

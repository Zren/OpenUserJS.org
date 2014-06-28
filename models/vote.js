var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ScriptVoteSchema = new Schema({
  vote: Boolean, // Upvote = true, Downvote = false
  _scriptId: {type: ObjectId, ref: 'Script'},
  _userId: {type: ObjectId, ref: 'User'}
});

var ScriptVoteModel = mongoose.model('Vote', ScriptVoteSchema);
exports.Vote = ScriptVoteModel;

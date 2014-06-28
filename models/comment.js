var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
  //--- Data
  _discussionId: {type: ObjectId, reg: 'Discussion'},
  author: String,
  _authorId: {type: ObjectId, reg: 'User'},
  content: String,
  created: {type: Date, default: Date.now},
  // updated: {type: Date, default: Date.now},
  creator: Boolean, // Is the first comment in a discussion.

  //--- Generated
  rating: Number,
  id: String, // Base16 of created.getTime()
});
CommentSchema.plugin(require('./mixins/moderated'));

var CommentModel = mongoose.model('Comment', CommentSchema);
exports.Comment = CommentModel;

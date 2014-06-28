var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DiscussionSchema = new Schema({
  //--- Data
  topic: String,
  category: String,
  comments: {type: Number, default: 0},
  author: String,
  _authorId: {type: ObjectId, reg: 'User'},
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},

  //--- Generated
  lastCommentor: String,
  // _lastCommentorId: {type: ObjectId, reg: 'User'},
  path: String,
  duplicateId: Number,
  rating: Number, // collectiveRating([Comment, ...])
  flagged: Boolean, // true if creator comment is flagged past discussion threshold

  //--- Issue fields
  // (yeah that's right, issues are just special discussions)
  issue: Boolean,
  open: Boolean,
  labels: [String],
});

var DiscussionModel = mongoose.model('Discussion', DiscussionSchema);
exports.Discussion = DiscussionModel;

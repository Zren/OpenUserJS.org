var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
  //--- Data
  name: String,
  role: Number,
  about: String,

  //--- Generated
  ghUsername: String, // Store their GitHub username when they import scripts
  sessionIds: [String],

  //--- AuthStrategy Data
  // A user can link multiple accounts to their OpenUserJS account
  auths: Array,
  strategies: Array,
});
UserSchema.plugin(require('./mixins/moderated'));

var UserModel = mongoose.model('User', UserSchema);
exports.User = UserModel;


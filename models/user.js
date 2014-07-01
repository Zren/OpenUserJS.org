var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userRoles = require('../models/userRoles.json');

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

//---
// Role
UserSchema.virtual('isMod').get(function(){
  return this.role < 4;
});
UserSchema.virtual('isAdmin').get(function(){
  return this.role < 3;
});
UserSchema.virtual('roleName').get(function(){
  return userRoles[this.role];
});

//
UserSchema.virtual('slug').get(function(){
  return this.name;
});

// Urls: Public
UserSchema.virtual('userPageUrl').get(function(){
  return '/users/' + this.name;
});
UserSchema.virtual('userCommentListPageUrl').get(function(){
  return this.userPageUrl + '/comments';
});
UserSchema.virtual('userScriptListPageUrl').get(function(){
  return this.userPageUrl + '/scripts';
});
UserSchema.virtual('userManageGitHubPageUrl').get(function(){
  return this.userPageUrl + '/github';
});
UserSchema.virtual('userGitHubRepoListPageUrl').get(function(){
  return this.userPageUrl + '/github/repos';
});
UserSchema.virtual('userGitHubRepoPageUrl').get(function(){
  return this.userPageUrl + '/github/repo';
});
UserSchema.virtual('userGitHubImportPageUrl').get(function(){
  return this.userPageUrl + '/github/import';
});
UserSchema.virtual('userEditProfilePageUrl').get(function(){
  return this.userPageUrl + '/profile/edit';
});
UserSchema.virtual('userUpdatePageUrl').get(function(){
  return this.userPageUrl + '/update';
});
UserSchema.virtual('userRemovePageUrl').get(function(){
  return '/remove/users/' + this.name;
});

//---
UserSchema.methods.githubUserId = function(){
  var indexOfGH = this.strategies.indexOf('github');
  if (indexOfGH > -1) {
    return this.auths[indexOfGH];
  } else {
    return null;
  }
};

//---
var UserModel = mongoose.model('User', UserSchema);
exports.User = UserModel;


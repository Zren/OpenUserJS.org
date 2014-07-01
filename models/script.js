var async = require('async');
var _ = require('underscore');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var humanizedDate = require('./mixins/humanizedDate');
var renderMd = require('../libs/markdown').renderMd;
var cleanFilename = require('../libs/helpers').cleanFilename;

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

//---
ScriptSchema.path('author').get(function(authorName){
  var User = this.model('User');
  return new User({
    name: authorName
  });
});

//---
ScriptSchema.virtual('icon16Url').get(function(){
  if (this.meta.icon) {
    if (_.isString(this.meta.icon)) {
      return this.meta.icon;
    } else if (_.isArray(this.meta.icon) && !_.isEmpty(this.meta.icon)) {
      return this.meta.icon[this.meta.icon.length - 1];
    }
  }
  return null;
});

ScriptSchema.virtual('icon45Url').get(function(){
  var icon45Url = this.icon16Url;
  if (this.meta.icon64)
    this.icon45Url = this.meta.icon64;
  return icon45Url;
});

ScriptSchema.virtual('support').get(function(){
  if (this.meta.supportURL) {
    var supportURL = null;
    if (_.isString(this.meta.supportURL)) {
      supportURL = this.meta.supportURL;
    } else if (_.isArray(this.meta.supportURL) && !_.isEmpty(this.meta.supportURL)) {
      supportURL = this.meta.supportURL[this.meta.supportURL.length - 1];
    }

    if (supportURL) {
      var htmlStub = '<a href="' + supportURL + '"></a>';
      if (htmlStub === sanitizeHtml(htmlStub, htmlWhitelistLink)) {
        return [{
          url: supportURL,
          text: decodeURI(supportURL),
          hasNoFollow: !/^(?:https?:\/\/)?openuserjs\.org/i.test(supportURL)
        }];
      }
    }
  }
});

ScriptSchema.virtual('fullName').get(function(){
  return this.author.name + '/' + this.name; // GitHub-like name
});

// Script Good/Bad bar.
// script.votes = count(upvotes) + count(downvotes)
// script.flags = flags - count(upvotes)
ScriptSchema.virtual('votesPercent').get(function(){
  var sumVotesAndFlags = this.votes + this.flags;
  var votesRatio = sumVotesAndFlags > 0 ? this.votes / sumVotesAndFlags : 0;
  return votesRatio * 100;
});
ScriptSchema.virtual('flagsPercent').get(function(){
  var sumVotesAndFlags = this.votes + this.flags;
  var flagsRatio = sumVotesAndFlags > 0 ? this.flags / sumVotesAndFlags : 0;
  return flagsRatio * 100;
});

// Urls: Slugs
ScriptSchema.virtual('authorSlug').get(function(){
  return this.author.name;
});
ScriptSchema.virtual('nameSlug').get(function(){
  return cleanFilename(this.name);
});
ScriptSchema.virtual('installNameSlug').get(function(){
  return this.author.slug + '/' + this.nameSlug;
});

// Urls:
ScriptSchema.virtual('scriptPageUrl').get(function(){
  var isLib = this.isLib || false;
  var scriptPath = this.installName
    .replace(isLib ? /\.js$/ : /\.user\.js$/, '');
  return (isLib ? '/libs/' : '/scripts/') + encodeURI(scriptPath);
});
ScriptSchema.virtual('scriptInstallPageUrl').get(function(){
  var isLib = this.isLib || false;
  return (isLib ? '/libs/src/' : '/install/') + this.installName;
});
ScriptSchema.virtual('scriptViewSourcePageUrl').get(function(){
  return this.scriptPageUrl + '/source';
});

// Urls: Issues
ScriptSchema.virtual('issuesCategorySlug').get(function(){
  var slug = (this.isLib ? 'libs' : 'scripts');
  slug += '/' + this.author.slug;
  slug += '/' + this.nameSlug;
  return slug + '/issues';
});
ScriptSchema.virtual('scriptIssuesPageUrl').get(function(){
  return '/' + this.issuesCategorySlug;
});
ScriptSchema.virtual('scriptOpenIssuePageUrl').get(function(){
  var slug = (this.isLib ? 'libs' : 'scripts');
  slug += '/' + this.author.slug;
  slug += '/' + this.nameSlug;
  return '/' + slug + '/issue/new';
});

// Urls: Author
ScriptSchema.virtual('scriptEditMetadataPageUrl').get(function(){
  var isLib = this.isLib || false;
  var scriptPath = this.installName
    .replace(isLib ? /\.js$/ : /\.user\.js$/, '');
  var editUrl = scriptPath.split('/');
  editUrl.shift();
  return (isLib ? '/lib/' : '/script/') + editUrl.join('/') + '/edit';
});
ScriptSchema.virtual('scriptEditSourcePageUrl').get(function(){
  return this.scriptViewSourcePageUrl;
});

// Urls: Moderation
ScriptSchema.virtual('scriptRemovePageUrl').get(function(){
  return '/remove' + (this.isLib ? '/libs/' : '/scripts/') + this.installNameSlug;
});

// Dates
ScriptSchema.plugin(humanizedDate('updated'));

// Markdown
ScriptSchema.virtual('scriptRemovePageUrl').get(function(){
  return renderMd(this.about);
});

//---
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

//---
var ScriptModel = mongoose.model('Script', ScriptSchema);
exports.Script = ScriptModel;

var config = {};

// Mongoose
config.mongoose = {};
var devDbMongooseUri = 'mongodb://nodejitsu_sizzlemctwizzle:b6vrl5hvkv2a3vvbaq1nor7fdl@ds045978.mongolab.com:45978/nodejitsu_sizzlemctwizzle_nodejitsudb8203815757';
config.mongoose.uri = process.env.CONNECT_STRING || devDbMongooseUri;

// Express
config.express = {};
config.express.sessionSecret = process.env.SESSION_SECRET || 'someSecretStringForSession';

// OpenUserJS
config.maximumScriptSize = 500000; // 500 kb
config.maximumScriptDescriptionSize = 1000000; // 1 Mb

module.exports = config;

var moment = require('moment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function(datePropName) {
  return (function(schema){
    schema.virtual(datePropName + 'ISOFormat').get(function() {
      return this[datePropName].toISOString();
    });
    schema.virtual(datePropName + 'Humanized').get(function() {
      return moment(this[datePropName]).lang('en-tiny').calendar();
    });
  });
};

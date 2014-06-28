var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = function(schema, options) {
  schema.add({
    flags: {type: Number, default: 0},
    flagged: {type: Boolean, default: false},
    // flagCount: {type: Number, default: 0},

    // approvedAt: Date,
    // approvedBy: {type: ObjectId, ref: 'User'},
  });
};

"use strict";

var mongoose = require('mongoose');

var url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function (result) {
  console.log('connected to MongoDB');
})["catch"](function (error) {
  console.log('error connecting to MongoDB:', error.message);
});
var noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean
});
noteSchema.set('toJSON', {
  transform: function transform(document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
module.exports = mongoose.model('Note', noteSchema);
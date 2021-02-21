"use strict";

var mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

var password = process.argv[2];
var url = "mongodb://fullstack:".concat(password, "@cluster0-shard-00-00.ycbnu.mongodb.net:27017,cluster0-shard-00-01.ycbnu.mongodb.net:27017,cluster0-shard-00-02.ycbnu.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-egahtk-shard-0&authSource=admin&retryWrites=true&w=majority");
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})["catch"](function (err) {
  return console.log(err.reason);
});
var noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});
var Note = mongoose.model('Note', noteSchema);
var note = new Note({
  content: process.argv[3],
  date: new Date(),
  important: process.argv[4]
});

if (process.argv[3] && process.argv[4]) {
  note.save().then(function (result) {
    console.log('added ', process.argv[3], ' ', process.argv[4], ' to phonebook');
    mongoose.connection.close();
  })["catch"](function (err) {
    return console.log('.... ', err.reason);
  });
}

var nbr = process.argv.length;

if (nbr === 3) {
  Note.find({}).then(function (result) {
    result.forEach(function (note) {
      console.log(note.content);
    });
    mongoose.connection.close();
  });
}
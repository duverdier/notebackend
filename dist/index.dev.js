"use strict";

var express = require('express');

var app = express();

require('dotenv').config();

var Note = require('./models/note');

var cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express["static"]('build'));
app.get('/api/notes', function (request, response) {
  Note.find({}).then(function (notes) {
    response.json(notes.map(function (note) {
      return note.toJSON();
    }));
  });
});
app.post('/api/notes', function (request, response, next) {
  var body = request.body;
  var note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });
  note.save().then(function (savedNote) {
    return savedNote.toJSON();
  }).then(function (savedAndFormattedNote) {
    response.json(savedAndFormattedNote);
  })["catch"](function (error) {
    return next(error);
  });
});
app.get('/api/notes/:id', function (request, response, next) {
  Note.findById(request.params.id).then(function (note) {
    if (note) {
      response.json(note.toJSON());
    } else {
      response.status(404).end();
    }
  })["catch"](function (error) {
    return next(error);
  });
});
app["delete"]('/api/notes/:id', function (request, response, next) {
  Note.findByIdAndRemove(request.params.id).then(function (result) {
    response.status(204).end();
  })["catch"](function (error) {
    return next(error);
  });
});
app.put('/api/notes/:id', function (request, response, next) {
  var body = request.body;
  var note = {
    content: body.content,
    important: body.important
  };
  Note.findByIdAndUpdate(request.params.id, note, {
    "new": true
  }).then(function (updatedNote) {
    response.json(updatedNote.toJSON());
  })["catch"](function (error) {
    return next(error);
  });
});

var unknownEndpoint = function unknownEndpoint(request, response) {
  response.status(404).send({
    error: 'unknown endpoint'
  });
};

app.use(unknownEndpoint);

var errorHandler = function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    });
  }

  next(error);
};

app.use(errorHandler);
var PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});
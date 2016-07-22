var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
  username: String,
  date: String,
  ip: String,
  ip_location: {},
  age: Number,
  social_media: String,
  images_resource: String,
  kind_of_art: String,
  mood: String,
});

var answerSchema = schema({
  picture: String,
  choice: String,
});

var quizSchema = schema({
  user: String,
  answers: [answerSchema],
  start: Date,
  end: Date,
});

module.exports = {
  User: mongoose.model('user', userSchema),
  Quiz: mongoose.model('quiz', quizSchema),
};
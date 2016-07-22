var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var expressSession = require('express-session');

var welcome = require('./routes/index');
var quiz = require('./routes/quiz');
var thanks = require('./routes/thanks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost/tinder-like-exp');
mongoose.Promise = global.Promise;

var MongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
  cookie: {
    httpOnly: true,
    maxAge: 3600000
  }
}));


app.use('/welcome/', welcome);
app.use('/quiz/', quiz);
app.use('/thanks/', thanks);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  console.log('404 error');
  if (err && err.status == 404) {
    res.redirect('/welcome/');
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// app.listen(3000, '127.0.0.1');

module.exports = app;

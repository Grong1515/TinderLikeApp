var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var fs = require('fs');

var db = require('../models');
var mongoose = require('mongoose');

router.use(auth);


router.get('/', function(req, res) {
  var randImg = req.session.image;
  res.render('quiz', {
    img: '/images/' + randImg,
  });
  });

router.post('/', function (req, res) {
  var answer = req.body.choice;
  var img = req.session.image;
  var quiz = mongoose.Types.ObjectId(req.session.user.quiz);
  db.Quiz.update({
    _id: quiz
  }, {
    $push: {
      answers: {
        picture: img,
        choice: answer,
      },
    },
    end: new Date(),
  }, function (err) {
    if (err) throw err;
    img = req.session.pictures.pop(Math.floor(Math.random() * req.session.pictures.length));
    if (!img) {
      res.redirect('/thanks/');
    } else {
      req.session.image = img;
      switch (answer) {
        case 'stop':
          req.method = 'get';
          res.redirect('/thanks/');
          break;
        default:
          var randImg = req.session.image;
          res.render('quiz', {
            img: '/images/' + randImg,
          });
      }
    }
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');

var satelize = require('satelize');
var db = require('../models');
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;


var reg_form = forms.create({
  username: fields.string({
    required: validators.required('This field is required'),
    label: 'Name',
  }),
  age: fields.number({
    required: validators.required('This field is required'),
    validators: [validators.range(3, 120)],
  }),
  social_media: fields.string({
    required: validators.required('This field is required'),
    label: 'Social Media Used Most',
  }),
  images_resource: fields.string({
    required: validators.required('This field is required'),
    label: 'Where do you go to see cool images online?'
  }),
  kind_of_art: fields.string({
    required: validators.required('This field is required'),
    label: 'What\'s your favorite kind of art?'
  }),
  mood: fields.string({
    required: validators.required('This field is required'),
    label: "What's your mood at the moment?",
  }),
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Psychology experiment',
    form: reg_form.toHTML(),
  });
});

router.post('/', function(req, res, next) {
  console.log('post');
  reg_form.handle(req, {
    success: function (form) {
      console.log('succes');
      var ip_location = null;
      satelize.satelize({ip: req.ip}, function (err, payload) {
        if (err) return next(err);
        ip_location = payload;
      });

      var user = new db.User({
        username: form.data.username,
        ip: req.ip,
        ip_location: ip_location,
        age: parseInt(req.body.age),
        social_media: req.body.social_media,
        images_resource: req.body.images_resource,
        kind_of_art: req.body.kind_of_art,
        mood: req.body.mood,
      });
      var quiz = new db.Quiz({
        user: user._id,
        answers: [],
        start: new Date(),
        end: null,
      });
      async.waterfall([
        function (callback) {
          user.save(function (err) {
            if (err) throw err;
            callback(null, user);
            console.log('user');
          })
        },
        function (user, callback) {
          quiz.save(function (err) {
            if (err) throw err;
            callback(null, quiz, user)
          })
        },
        function (quiz, user, callback) {
          fs.readdir('./public/images', function (err, items) {
            if (err) next(err);
            else {
              callback(null, items, quiz, user);
            }
          });
        }
      ], function (err, pictures, quiz, user) {
        if (err) throw err;
        req.session.user = {
          username: user.username,
          quiz: quiz._id,
          user: user._id,
        };
        req.session.image = pictures.pop(Math.floor(Math.random() * pictures.length));
        req.session.pictures = pictures;
        res.redirect('/quiz/');
      });


    },
    error: function (form) {
      console.log('error field');
      res.render('index', {
        title: 'Psychology experiment',
        form: form.toHTML(),
      });
    }
  });
});

module.exports = router;

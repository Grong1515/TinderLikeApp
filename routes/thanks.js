var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

router.use(auth);


router.get('/', function(req, res, next) {
  res.render('thanks');
  setTimeout(function () {
    req.session.destroy(function(err) {
      if (err) next(err);
    });
  }, 0);
});

module.exports = router;
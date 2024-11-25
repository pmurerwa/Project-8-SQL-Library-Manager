var express = require('express');
var router = express.Router();

/* GET home page, redirect to Books. */
router.get('/', function(req, res, next) {
  res.redirect('/books'); // Redirect to books listing page
  //res.render('index', { title: 'Express' });
});

module.exports = router;

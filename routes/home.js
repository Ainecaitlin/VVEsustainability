var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

// Home
router.get('/', function(req, res){
  res.render('home/welcome');
});
router.get('/about', function(req, res){
  res.render('home/about');
});
// advice
router.get('/advice', function(req, res){
  res.render('advice/advice');
});
router.get('/advice-information', function(req, res){
  res.render('advice/information');
});
router.get('/advice-search', function(req, res){
  res.render('posts');
});
// led lighting
router.get('/led', function(req, res){
  res.render('led/led');
});
router.get('/led-information', function(req, res){
  res.render('led/information');
});
router.get('/led-search', function(req, res){
  res.render('posts');
});
// insulation
router.get('/insulation', function(req, res){
  res.render('insulation/insulation');
});
router.get('/insulation-information', function(req, res){
  res.render('insulation/information');
});
router.get('/insulation-search', function(req, res){
  res.render('posts');
});
// hr++
router.get('/hr', function(req, res){
  res.render('hr/hr');
});
router.get('/hr-information', function(req, res){
  res.render('hr/information');
});
router.get('/hr-search', function(req, res){
  res.render('posts');
});
// energy generation
router.get('/energy-generation', function(req, res){
  res.render('energy-generation/energy-generation');
});
router.get('/energy-generation-information', function(req, res){
  res.render('energy-generation/information');
});
router.get('/energy-generation-search', function(req, res){
  res.render('posts');
});
// charging station
router.get('/charging-station', function(req, res){
  res.render('charging-station/chargin-station');
});
router.get('/charging-station-information', function(req, res){
  res.render('charging-station/information');
});
router.get('/charging-station-search', function(req, res){
  res.render('posts');
});
// finance
router.get('/finance', function(req, res){
  res.render('finance/finanace');
});
router.get('/finanace-information', function(req, res){
  res.render('finance/information');
});
router.get('/finanace-search', function(req, res){
  res.render('posts');
});


// Login
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

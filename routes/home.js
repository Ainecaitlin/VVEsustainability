//********** CONTRIBUTOR: RAYYAN + HWAJUN**********//
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var fs = require('fs');

//************* AUTHENTICATION *********************//
const connectEnsureLogin = require('connect-ensure-login');
var passport = require('../config/passport');
var apartmentArray = [];
var mapDataModel;
var apartmentArray = [];
var chatArray = [];
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema(
    {
    
	message: {
		type: Schema.Types.String,
	},
    sender: {
    type: Schema.Types.String,
    },
    chatroom: {
    type: Schema.Types.String,
    }
});
var chatDataModel;
var rooms = {a:'General-Chat',b:'Solar-Panel',c:'Finance', d:'Charging-Station'};
const fetch = require("node-fetch");
var userName;
var chatDataModels = mongoose.modelNames();
/****** SCHEMA **********/
//Define a schema
var MapSchema = Schema; //Define variable that will contain our map data
/* The JSON Schema for an Apartment colllection according to the Database */
var MapModelSchema = new Schema( 
{
 vve_id : Schema.Types.Number, //Identifiers
 longitude : Schema.Types.String, //Longitutde Opted to use String values to prevent precision error and ambuigity in transfer
 latitude : Schema.Types.String, //Latitude
 //Status Object
 status : {insulation : Schema.Types.Number, energy : Schema.Types.Number, charge : Schema.Types.Number, finance : Schema.Types.Number, legal : Schema.Types.Number, supply : Schema.Types.Number, risk : Schema.Types.Number}, 
 //Address Object
 address : { street : Schema.Types.String, number : Schema.Types.Number, city : Schema.Types.String, post_code : Schema.Types.String }
}
); 
/* I made this function so unnecessary replication of data and extra computations are not done
If a model already exists, we will simply use that model instead of creating a new one*/
function modelAlreadyDeclared (m) {
  try {
    mongoose.model(m)  // it throws an error if the model is still not defined
    return true
  } catch (e) {
    return false
  }
}
/*************INCOMING ROUTES*****************/
// Direct to Home
router.get('/', function (req, res) {
    apartmentArray = loadMap(res);
});
// Click on Chat
var CHAT_ROOMS = 7
router.get('/chats/:rooms', connectEnsureLogin.ensureLoggedIn(), function (req, res){
    var room = req.params.room;
	 var room3 = req.params.rooms;
	var room2 = req.query.room;
console.log("LOAD CHAT : " + room3);
   if(modelAlreadyDeclared(room3)){ mongoose.deleteModel(room3);}
chatArray = loadChat(res, room3);
});
async function loadMap(res){
      /* Back-End code for obtaining VVE Geolocations*/
    if(!modelAlreadyDeclared('Apartment')){
        mapDataModel = mongoose.model('Apartment', MapModelSchema, 'Apartment');
    }
	 console.log("Load Map Debug: " + mapDataModel.db.name);
     var rawApartmentArray = [];
     console.log("Searching for Apartments..");
     const query =  mapDataModel.find();
     var promise = query.then(function (docs, err){
     if(err){
        console.log("Error caught during query.then" + err);
     }
     else{
            console.log("Search results: " + docs.length);
        
    res.locals.apartmentArray = docs;
    console.log(docs);
        console.log("Type of Map 'docs' " + typeof(docs));
    console.log("res.locals.apartmentArray has been set");
    res.render('home/mapPage.ejs', {data: docs});
    console.log("res.render() called");
    return docs;
    }
}).catch(err => {
    console.log(err);
});
    return rawApartmentArray;
}
function roomToIndex(room){
    if(room == "General-Chat"){ return 0; }
    else if(room == "Solar-Panel"){ return 1; }
    else if(room == "Finance"){return 2;}
    else if(room == "Charging-Station"){ return 3;}
}
var chatDataModel;
async function loadChat(res, room){
    //***Load all chat messages in the DB into a JSON and push to client-side***//
    var chatDataModel = mongoose.model(room, chatSchema, room);
	console.log("CHAT DEBUG:" + chatDataModel.db.name + "room var:" + room);
    const chatQuery = chatDataModel.find(); //Query Chatroom Data
    var chatPromise = chatQuery.then(
    function (docs, err)
     {
        if(err)
        {
            console.log("Error caught during Chat Query: " + err);
        }
    else
     {
         //Promise was kept and document loaded without error
        console.log("Chat results:" + docs.length);    
        console.log(docs);
        console.log("Type of Chat 'docs':" + typeof(docs));
        res.render('home/' + room + '.ejs', {chatData: docs, userName: userName});
        console.log("Chat: home/" + room + '.ejs', " rendering... username: " + userName);
         
        return docs;
     }
    }).catch(err => {
    console.log(err);
  });
    mongoose.deleteModel(room); //Clean up
 return chatArray;   
}

// ROUTES

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
  res.render('charging-station/charging-station');
});
router.get('/charging-station-information', function(req, res){
  res.render('charging-station/information');
});
router.get('/charging-station-search', function(req, res){
  res.render('posts');
});
// finance
router.get('/finance', function(req, res){
  res.render('finance/finance');
});
router.get('/finance-information', function(req, res){
  res.render('finance/information');
});
router.get('/finanace-search', function(req, res){
  res.render('posts');
});
router.get('/shop', function(req, res){
  res.render('shop/shop');
});

// Side navigation
//find vve
router.get('/map', function(req, res){
  res.render('/map/map.ejs');
});
//newsletter
router.get('/newsletter', function(req, res){
  res.render('newsletter/newsletter');
});
// support
router.get('/support', function(req, res){
  res.render('home/contact');
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
        userName = req.body.username;
        console.log("username set to:" + userName);
        next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
module.exports = router;

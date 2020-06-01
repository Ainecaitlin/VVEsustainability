var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var fs = require('fs');
var passport = require('../config/passport');
var apartmentArray = [];
var mapDataModel;
var apartmentArray = [];
var chatArray = [];
//var socket = io();
const Chat = require("./chatschema.js");
const fetch = require("node-fetch");
        /****** SCHEMA **********/
//Define a schema
const Schema = mongoose.Schema; //To make my life easier
var MapSchema = Schema; //Define variable that will contain our map data
/* The JSON Schema for an Apartment colllection according to the Database */
var MapModelSchema = new Schema( 
{_id : Schema.Types.ObjectId,
 vve_id : Schema.Types.Number, //Identifiers
 longitude : Schema.Types.String, //Longitutde Opted to use String values to prevent precision error and ambuigity in transfer
 latitude : Schema.Types.String, //Latitude
 //Status Object
 status : {insulation : Schema.Types.Number, energy : Schema.Types.Number, charge : Schema.Types.Number, finance : Schema.Types.Number, legal : Schema.Types.Number, supply : Schema.Types.Number, risk : Schema.Types.Number}, 
 //Address Object
 address : { street : Schema.Types.String, number : Schema.Types.Number, city : Schema.Types.String, post_code : Schema.Types.String }
}
); 
//
/*
io.on('connection', socket  =>  {
        console.log("user connected");
        socket.on('disconnect', function() {
            console.log("user disconnected");
        });  
        socket.on('chat message', function(msg) {
            console.log("message: "  +  msg);
            //broadcast message from client A to all clients
            io.broadcast.emit("received", { message: msg  });
            //
            //I am testing if the message functionality stores this message or not
            let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
            chatMessage.save();
        })
    });
*/
/* I made this function so unnecessary replication of data and extra computations are not done
If a model already exists, we will simply use that model instead of creating a new one*/
function modelAlreadyDeclared () {
  try {
    mongoose.model('Apartment')  // it throws an error if the model is still not defined
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
router.get('/chats', function (req, res){
    
    chatArray = loadChat(res);
});
async function loadMap(res){
      /* Back-End code for obtaining VVE Geolocations*/
     mapDataModel = mongoose.model('Apartment', MapModelSchema, 'Apartment');
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
async function loadChat(res){
    //***Load all chat messages in the DB into a JSON and push to client-side***//
    const chatQuery = Chat.find();
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
        //res.locals.chatData = docs;
        console.log(docs);
        console.log("Type of Chat 'docs':" + typeof(docs));
        //res.render('home/chat.ejs', { html: html }); //Render it in EJS 
         
         //res.json(docs);
         //res.sendFile(__dirname + '/chat.html');
         //console.log("Sending Chat.html via RES");
         
        res.render('home/chat.ejs', {chatData: docs});
        console.log("Chat.ejs rendering... Chat messages: " + docs.length);
         
        return docs;
     }
    }).catch(err => {
    console.log(err);
  });
 return chatArray;   
}
router.get('/about', function(req, res){
  res.render('home/about');
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

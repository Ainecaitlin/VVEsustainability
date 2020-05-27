var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('../config/passport');
var apartmentArray = [];
var mapDataModel;
var apartmentArray = [];

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
/*******************************/
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
/*********************************/
// Home
router.get('/', function (req, res) {
    /*if (!modelAlreadyDeclared()) {
        //If we have not yet created the Model, make it now.

        mapDataModel = mongoose.model('Apartment', MapModelSchema,'Apartment'); //Assign the schema to a model labelled 'Apartment' 
        apartmentArray = loadMap();
    }else{
        //(arg1) and query it to the collection named 'Apartment' (arg2)
        apartmentArray = loadMap();
    }*/
/* ************** */
  //res.render('home/welcome.ejs', {apartmentArray: apartmentArray}); //Display the welcome page and pass the array into it
    apartmentArray = loadMap(res);
   // res.jsonp(apartmentArray);
});

async function loadMap(res){
      /* Back-End code for obtaining VVE Geolocations*/
 
     mapDataModel = mongoose.model('Apartment', MapModelSchema, 'Apartment');
 
//const apartmentList = await mapDataModel.find(); //Find all Apartments
//Cursor acts as a buffer, when the VVE-Apartments scale up this will keep the querying within bandwith
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
        console.log("Type of 'docs' " + typeof(docs));
    console.log("res.locals.apartmentArray has been set");
    res.render('home/mapPage.ejs', {data: docs});
    console.log("res.render() called");
            return docs;
    }
}).catch(err => {
    console.log(err);
});
            /*for (var i in results){
                console.log(results[i]);
                rawApartmentArray.push(results[i]);
                console.log('added apartment');
            }
        })
  /*  const promise = await Promise.all(array)
    res.json(promise)
    for(var item in promise){
  // Extract Longitude and Latitude variables into an object
        console.log("Putting DB data into package.")
    var apartmentData = {
	    latitude : item.latitude,
        longitude : item.longitude,
        status : item.status
        }
        console.log("Pushing apartment" + item.latitude + " into apartmentArray");
        // Pass this object into our global variable array
        apartmentArray.push(apartmentData);
    }*/
    return rawApartmentArray;
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

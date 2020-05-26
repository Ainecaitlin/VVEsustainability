var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
var app = express();
//==== Adding some debugging stuff here ====///
  var http=require('http');

var server=http.createServer(function(req,res){
    res.end('test');
});

server.on('listening',function(){
    console.log('ok, server is running');
});
const path = require('path')
//========== End of debug stuff =======///
// DB setting
const db = require('./config/key').MongoURI;

//Connect mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err))

//other setting  
app.set('view engine', 'ejs');
app.set('views', './views/');
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));
  
// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.util = util;
  next();
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/comments', util.getPostQueryString, require('./routes/comments'));
app.use('/files', require('./routes/files'));
  
/* Back-End code for obtaining VVE Geolocations*/
//Define a schema
var MapSchema = mongoose.Schema; //Define variable that will contain our map data
/* The JSON Schema for an Apartment colllection according to the Database */
var MapModelSchema = new Schema( 
{"_id":{"$oid":"5ea098018774630e045e8d8e"},"vve_id":{"$oid":"5ea0980b8774630e045e8d8f"}, //Identifiers
 "longitude":{"$numberDecimal":"0"}, //Longitutde
 "latitude":{"$numberDecimal":"0"}, //Latitude
 "status":{"insulation":0,"energy":0,"charge":0,"finance":0,"legal":0,"supply":0,"risk":0}, //Status Object
 "address":{"street":"Heresingel","number":22,"city":"Groningen","post_code":"9711ET"}}); //Address Object


var mapDataModel = mongoose.model('MapModel', MapModelSchema); //Assign the schema to a model labelled 'Map Model'
const cursor = mapDataModel.find().cursor(); //Find all Apartments
//Cursor acts as a buffer, when the VVE-Apartments scale up this will keep the querying within bandwith

for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  // Extract Longitude and Latitude variables
    var apartmentData = {
	latitude: {doc.latitude},
    longitude: {doc.longitude},
    status: {doc.status}
    }
  // Pass these variables to Javascript
}


/* ************** */
// Port setting
var port = 8000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
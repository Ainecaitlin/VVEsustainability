var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
var app = express();
  
// DB setting
const db = require('./config/key').MongoURI;

//Connect mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err))

//other setting  
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));
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
  
// Port setting
var port = process.env.PORT || 4000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
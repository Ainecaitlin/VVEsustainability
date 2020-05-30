var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
var express = require('express');
//require the http module
// require the socket.io module & express
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
// Port setting
var port = 8000;
var listener = server.listen(port, function(){
  console.log('server on! http://localhost:'+port + "app.get(port) = " + app.get('port'));

const path = require('path')
// DB setting
const db = require('./config/key').MongoURI;
//Connect Express
//Connect mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => {
    console.log('DB connected...');
    //setup event listener AFTER DB connection fulfills promise
    io.on("connect", socket  =>  {
        console.log("user connected");
        socket.on("disconnect", function() {
            console.log("user disconnected");
        });  
        io.on("chat message", function(msg) {
            console.log("message: "  +  msg);
            //broadcast message from client A to all clients
            io.sockets.broadcast.emit("received", { message: msg  });
            //********** DEBUG ****************//
            //I am testing if the message functionality stores this message or not
            let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
            chatMessage.save();
        })
    });
})
.catch(err => console.log(err));

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
app.use('/chats', require('./routes/home')); //Routing all requests for the chat into home 
app.get('/givemejquery', function(req, res){ //Providing the client with our jquery
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});
    app.get('/givemeasocket', function(req, res){ //Providing the client with our socket.js
        res.sendFile(__dirname + '/node_modules/socket.io/socket.io.js');
    });
/* ************** */
});
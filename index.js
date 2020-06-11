var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
var app = express();

//******** AUTHENTICATION **********//
const connectEnsureLogin = require('connect-ensure-login');
var passport = require('./config/passport');
var util = require('./util');
var express = require('express');

//require the http module
// require the socket.io module & express
var Chat= require('./routes/chatschema.js')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
io.set("transports", ["polling"]);
  
// DB setting
const db = require('./config/key').MongoURI;
//Connect mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(function(){console.log('DB connected...');
console.log(db.name); })
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
//Dynamically add each chatroom route to our Express, redirecting to home for loading of Chat
app.use('/chats/:rooms', require('./routes/home'));

//Catch a connection event that has been routed to the node server into nameSpace /chats
//Create an Array of NameSpaces, For each run the code below
var nameSpaces = [];
var rooms = ['General-chat','Solar-Panel','Finance', 'Charging-Station' ];

var fs = require('fs');
var array = fs.readFileSync('./config/chatroomMasterFile.txt').toString().split("\n");
/*for(room in rooms) {
    console.log("adding room:" + room);
    rooms.push(array[i]);
    console.log("rooms["+ room + "]: " + rooms[rooms.length-1]);
} //= */
console.log("Pulling Chatroom Master file....:" + rooms[rooms.length-1]);
var CHAT_ROOMS = 7; //The number of chatrooms, this variable controls the ini of sockets, namespaces and routes.
var i =0;
for(var room in rooms){
    nameSpaces.push(io.of('/chats' + room)); //domain.com/chats/General-Chat
	console.log("Creating namespace /chats" + room);
    nameSpaces[nameSpaces.length-1].on('connection', socket  =>  {
            console.log("user connected to Channel:" + room + " , migrating user to general chat.");
            socket.leave(socket.id); //Bug Fix for dual entries
            socket.join(room);
            socket.on('disconnect', function() {
                console.log("user disconnected");
            });  
            socket.on('chat message', function(data) {
                console.log("message: "  +  data.message + "User: " + data.sender + "Room:" + room);
                //broadcast message from client A to all clients in client A's current room
                nameSpaces[i].to(room).emit("received", { message: data.message, sender: data.sender ,chatroom:room });
                
            //I am testing if the message functionality stores this message or not
            let  chatMessage  =  new Chat({ sender: data.sender, chatroom: room ,message: data.message});
            chatMessage.save();
        })
    });
    i++;
}

app.get('/givemejquery', function(req, res){ //Providing the client with our jquery
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});
  app.get('/givemeasocket', function(req, res){ //Providing the client with our socket.js
      res.sendFile(__dirname + '/node_modules/socket.io/lib/socket.js');
  });
/* *******ACTIVATE SERVER LISTENER******* */
// Port setting
var port = 8000;
const path = require('path')
http.listen(port, function(){
console.log('server on! http://localhost:'+port + "app.get(port) = " + app.get('port'));

});

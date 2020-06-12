//#*********** CONTRIBUTOR: RAYYAN ****************//
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
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
io.set("transports", ["polling"]);
  
// DB setting
const db = require('./config/key').MongoURI;
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
//Connect mongo
mongoose.connect('mongodb://127.0.0.1:27017/VVE_DB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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
const rooms = {0:"General-Chat",1:"Solar-Panel",2:"Finance", 3:"Charging-Station" };
var chatDataModels = [];
var fs = require('fs');
//***** Dynamic loading of chatrooms, that admin can edit via the website. Removed for now as the last merge
//left me with even more bugs to fix by myself :)
/*var array = fs.readFileSync('./config/chatroomMasterFile.txt').toString().split("\n");
for(room in rooms) {
    console.log("adding room:" + room);
    rooms.push(array[i]);
    console.log("rooms["+ room + "]: " + rooms[rooms.length-1]);
} //= */
var CHAT_ROOMS = 7; //The number of chatrooms, this variable controls the ini of sockets, namespaces and routes.
var chatroomSockets =[];
function createNameSpace(n){
    var nameSpace = io.of('/chats/'+n); 
     //domain.com/chats/General-Chat will have socket /chats0
    nameSpace.on('connection', socket => { 
        var chatRoom, userName;
        socket.handshake.query['chatRoomID'] = chatRoom;
        socket.handshake.query['user'] = userName;
        console.log("User:" + userName + "connected on Channel: " + chatRoom); 
            socket.leave(socket.id); //Bug Fix for dual entries
            socket.join(chatRoom);
            socket.on('disconnect', function() {
                console.log("user disconnected");
            });  
           socket.on('chat message', function(data) {
               
                console.log("message: "  +  data.message + "User: " + data.sender + "Room:" + chatRoom);
                //broadcast message from client A to all clients in client A's current room
                nameSpace.to(chatRoom).emit("received", { message: data.message, sender: data.sender ,chatroom:rooms[roomIndex] });
               
                if(!modelAlreadyDeclared(chatRoom)){ var chatDataModel = mongoose.model(rooms[roomIndex], chatSchema, rooms[roomIndex]); }
               
               let chatMessage = new chatDataModels[roomIndex]({ message: data.message, sender: data.sender ,chatroom:data.room});
               chatMessage.save(function(err){
                if(err){
                    console.log("CHAT WRITE ERROR: Index.JS 111" + err);
                }else{
                    console.log("Writing message to:"+rooms[roomIndex]);
                    mongoose.deleteModel(rooms[roomIndex]); //Clean up
                }
            });
        });

    });
}
	console.log("Creating namespace /chats" + roomIndex);
    chatDataModels.push(mongoose.model(rooms[roomIndex], chatSchema, rooms[roomIndex])); //Each chatroom needs its designated model pointing to the appropiate collection in the DB
}
createNameSpace('General-Chat');
createNameSpace('Finance');
createNameSpace('Solar-Panel');
createNameSpace('Charging-Station');
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
module.export = chatDataModels;


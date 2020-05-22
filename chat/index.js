var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var socket = require('socket.io')(http);
const connect = require("./dbconnection.js");
const Chat = require("./chatschema.js");
const fetch = require("node-fetch");


const  bodyParser  = require("body-parser");
const  chatRouter  = require("./chatRouter.js");

//bodyparser middleware
app.use(bodyParser.json());
//routes
app.use("/chats", chatRouter);

socket.on("connection", socket  =>  {
  console.log("A user connected");
  socket.broadcast.emit('chat message','A user connected')
  socket.on("disconnect", function() {
  console.log("A user disconnected");
  socket.broadcast.emit('chat message','A user disconnected')
  });  
  socket.on("chat message", function(msg) {
      console.log("message: "  +  msg);
      socket.broadcast.emit('chat message', msg);
      //socket.emit('chat message', msg);// okay this part is a bit finnicky, we send messages to everyone and to ourselves at the same time but i think since we want to save to database we dont want to send ourselves a message
 // socket.broadcast.emit("received", { message: msg  });
  connect.then(db  =>  {
  console.log("connected correctly to the server");
  let  chatMessage  =  new Chat({ message: msg, sender: "Dante", chatroom: "Solar Panel"});
  chatMessage.save();
  console.log("message saved correctly to the server");
  });
  });
});



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var socket = require('socket.io')(http);
const connect = require("./dbconnection.js");
const Chat = require("./chatschema.js")
const fetch = require("node-fetch");


const  bodyParser  = require("body-parser");
const  chatRouter  = require("./chatRouter.js");

//bodyparser middleware
app.use(bodyParser.json());
//routes
app.use("/chats", chatRouter);

/*(function() {
  fetch("/chats/chats")
  .then(data  =>  {
  return  data.json();
  })
.then(json  =>  {
json.map(data  =>  {
let  li  =  document.createElement("li");
let messages = docuemtn.getElementById("messages")
let  span  =  document.createElement("span");
messages.appendChild(li).append(data.message);

  messages
  .appendChild(span)
  .append("by "  +  data.sender  +  ": "  +  formatTimeAgo(data.createdAt));
});
});
})();*/


/*io.on('connection', function(socket){ //message 
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  connect.then(db  =>  {
    console.log("succesfully connected to the chat")
    let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
    chatMessage.save();
    }); 
});

io.on('connection', function(socket){ //connect/disconnect message
  console.log('a user connected');
  io.emit('chat message','A user connected')
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message','A user disconnected')
  });
});*/
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
      socket.emit('chat message', msg);// okay this part is a bit finnicky, we send messages to everyone and to ourselves at the same time but i think since we want to save to database we dont want to send ourselves a message
 // socket.broadcast.emit("received", { message: msg  });
  connect.then(db  =>  {
  console.log("connected correctly to the server");
  let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
  chatMessage.save();
  });
  });
});
/*//isTyping event
messageInput.addEventListener("keypress", () =>  {
  socket.emit("typing", { user: "Someone", message: "is typing..."  });
  });
  socket.on("notifyTyping", data  =>  {
  typing.innerText  =  data.user  +  "  "  +  data.message;
  console.log(data.user  +  data.message);
  });
  //stop typing
  messageInput.addEventListener("keyup", () =>  {
  socket.emit("stopTyping", "");
  });
  socket.on("notifyStopTyping", () =>  {
  typing.innerText  =  "";
  });

  //Someone is typing
socket.on("typing", data => { 
  socket.broadcast.emit("notifyTyping", { user: data.user, message: data.message }); }); 
//when soemone stops typing
socket.on("stopTyping", () => { socket.broadcast.emit("notifyStopTyping"); });*/


/*(function(){
  socket.on("received", data  =>  {
  let  li  =  document.createElement("li");
  let  span  =  document.createElement("span");
  var  messages  =  document.getElementById("messages");
  messages.appendChild(li).append(data.message);
  messages.appendChild(span).append("by "  +  "anonymous"  +  ": "  +  "just now");
  });
  })*/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
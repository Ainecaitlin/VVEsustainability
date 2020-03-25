var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('chat message','A user connected')
  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message','A user disconnected')
  });
});

/*
io.on('connection', function (socket) {
  socket.on('disconnect', function(){
  io.emit('user connected');
  });
});

io.on('disconnect', function (socket) {
  socket.on('disconnect', function(){
  io.emit('user disconnected');
  });
});*/

http.listen(3000, function(){
  console.log('listening on *:3000');
});
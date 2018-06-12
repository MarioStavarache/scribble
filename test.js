var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
  });

io.on('connection', function(socket){

    //socket.emit('entrance', {message: 'Welcome to the chat room!'}); 
    //socket.emit('entrance', {message: 'Your ID is #' + socket.id}); 

    //adding a user to the players list.
    socket.on('addUser', function (name) {
        players.push(name);
        io.emit('addUser', name);
        io.emit('init', players);
     });

    socket.on('server message', function(msg){
        io.emit('server message', msg);
    });

    /*
    socket.on('disconnect message', function(nickname){
      console.log(nickname + " disconnected");
      io.emit('disconnect message', nickname);
    });
    */

    socket.on('connect message', function(nickname){
        io.emit('connect message', nickname);
    })

    socket.on('chat message', function(msg, nickname){
        io.emit('chat message', msg, nickname);
    });

    socket.on('mouse', function(data){
        socket.broadcast.emit('mouse', data);
    });

    socket.on('clear', function(){
        socket.broadcast.emit('clear');
    });

    socket.on('time', function(time){
        socket.broadcast.emit('time', time);
    });
  });

  
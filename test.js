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
    socket.on('adduser', function (name) {
        io.emit('init', players);
        players.push(name);
        io.emit('adduser', name);
        socket.once('disconnect', function () {
            var pos = players.indexOf(name);
   
            if (pos >= 0)
              players.splice(pos, 1);
          });
     });


    socket.on('server message', function(msg){
        io.emit('server message', msg);
    });

    socket.on('connect message', function(nickname){
        io.emit('connect message', nickname);
    })

    socket.on('chat message', function(msg, nickname){
        io.emit('chat message', msg, nickname);
    });

    socket.on('mouse', function(data){
        io.emit('mouse', data);
    });

    socket.on('clear', function(){
        io.emit('clear');
    });

    socket.on('time', function(time){
        io.emit('time', time);
    });
  });

  
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    /*
    socket.on('disconnect message', function(nickname){
      console.log(nickname + " disconnected");
      io.emit('disconnect message', nickname);
    });
    */
    socket.on('connect message', function(nickname){
        socket.broadcast.emit('connect message', nickname);
    })

    socket.on('chat message', function(msg, nickname){
        socket.broadcast.emit('chat message', msg, nickname);
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});
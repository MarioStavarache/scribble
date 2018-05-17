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
        console.log(nickname);
        io.emit('connect message', nickname);
    })

    socket.on('chat message', function(msg, nickname){
        io.emit('chat message', msg, nickname);
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
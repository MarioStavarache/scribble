var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];
var points = [];
var word = "";

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
  });

io.on('connection', function(socket){ 

    //adding a user to the players list.
    socket.on('adduser', function (name) {
        io.emit('init', players);
        players.push(name);
        points.push(0);
        io.emit('adduser', name);
        io.emit('leaderBoard', players, points);
        socket.once('disconnect', function () {
            var pos = players.indexOf(name); 
            if (pos >= 0) {
              players.splice(pos, 1);
              for (let j = 0; j < points.length; j++) {
                  points.splice(j,1,0);               
              }
              io.emit('leaderBoard', players, points);
            }
          });
     });


     //handling disconnection
     socket.on('disconnect', function(){
        io.emit('disconnect');
     });


     //sending messages to the clients from the server
    socket.on('server message', function(msg){
        io.emit('server message', msg);
    });

    //message that occurs if a user connects
    socket.on('connect message', function(nickname){
        io.emit('connect message', nickname);
    });

    //function to get the selected word
    socket.on('word', function(selectedWord){
        word = selectedWord;
    });

    //function for chat messages
    socket.on('chat message', function(msg, nickname){
        if (msg.toLowerCase() == word) {
            io.emit('right message', msg, nickname);
            for (let i = 0; i < players.length; i++) {
                if (players[i] == nickname) {
                    points[i] += 3;
                    io.emit('leaderBoard', players, points);
                }          
            }
            io.emit('clear');
            io.emit('time', 1);
        } else {
            io.emit('chat message', msg, nickname);
            io.emit('winners', points);
        }        
    });

    //event at the end of the game
    socket.on('end', function(){
        io.emit('end', points);
    });

    //capturing mouse data for drawing
    socket.on('mouse', function(data){
        io.emit('mouse', data);
    });

    //clearing/reseting the whiteboard
    socket.on('clear', function(){
        io.emit('clear');
    });

    //time function for the drawer
    socket.on('time', function(time){
        io.emit('time', time);
    });

  });

  
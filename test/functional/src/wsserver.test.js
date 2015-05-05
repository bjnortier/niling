var path = require('path');
// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// // app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));

// io.on('connection', function(socket) {
//   console.log('a user connected', socket);
// });

// var port = Number(process.env.PORT || 8000);
// app.listen(port, function() {
//   console.log('Listening on ' + port);
// });


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
  console.log('client connected');
  socket.on('chat message', function(msg) {
    console.log(msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
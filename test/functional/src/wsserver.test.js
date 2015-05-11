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

var InMemoryContainer = require('../../../lib/containers/InMemoryContainer');
var WebSocketConnector = require('../../../lib/connectors/WebSocketConnector');

var container = new InMemoryContainer('serverinmem');

app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('client connected');
  var wsConnector = new WebSocketConnector(socket, container);
  wsConnector.on('synced', function(hash) {
    console.log('synced to server', hash);
  });

  container.add({source: 'server', data: [10,11,12]}, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('added data to server');
    }
  });
});


http.listen(3000, function() {
  console.log('listening on *:3000');
});
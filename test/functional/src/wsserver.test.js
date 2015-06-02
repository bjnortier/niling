var path = require('path');
var chalk = require('chalk');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid');

var Container = require('../../../lib/containers/Container');
var InMemoryStore = require('../../../lib/stores/InMemoryStore');
var WebSocketConnector = require('../../../lib/connectors/WebSocketConnector');

var container = new Container('serverinmem', new InMemoryStore());

app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('client connected');
  var wsConnector = new WebSocketConnector(socket, container);

  container.putObject({source: 'server', data: [10,11,12]}, {}, function(err, result) {
    if (err) {
      console.error(chalk.red(err));
    } else {
      console.log('server put object success', result.hash);
    }
  });

  var ref = uuid.v4().substr(0, 8);

  // Create a reference
  container.putReference(ref, {source: 'server', data: 'a1'}, {}, function(err, result) {
    if (err) {
      console.error(chalk.red(err));
    } else {
      console.log('server put reference success %s:%s', ref, result.version);

      // Update a reference
      container.updateReference(ref, {source: 'server', data: 'a2'}, result.version, {}, 
        function(err, result) {
          if (err) {
            console.error(chalk.red(err));
          } else {
            console.log('server update reference success %s:%s', ref, result.version);
          }
        });
    }
  });

  wsConnector.on('synced', function(hash) {
    console.log('synced to server', hash);
  });

});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

var uuid = require('uuid');
var io = require('socket.io-client');

var socket = io();

var Container = require('../../../lib/containers/Container');
var InMemoryStore = require('../../../lib/stores/InMemoryStore');
var WebSocketConnector = require('../../../lib/connectors/WebSocketConnector');

var container = new Container('browserinmem', new InMemoryStore());
var wsConnector = new WebSocketConnector(socket, container);

wsConnector.on('synced', function(hash) {
  console.log('synced to browser', hash);
});

// Put an object
container.putObject({source: 'browser', data: [0,1,2]}, {}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log('browser put object success', result.hash);
  }
});

// Put a reference
var ref = uuid.v4().substr(0, 8);

container.putReference(ref, {source: 'browser', data: 'b'}, {}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log('browser put reference success', ref, result.version);

    // Update a reference
    container.updateReference(ref, {source: 'browser', data: 'b2'}, result.version, {}, 
      function(err, result2) {
        if (err) {
          console.error(err);
        } else {
          console.log('browser put reference success', ref, result2.version);
        }
      });
  }
});

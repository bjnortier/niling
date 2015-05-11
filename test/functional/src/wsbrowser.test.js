var io = require('socket.io-client');
// var $  = require('jquery');
// console.log(io);

var socket = io();
// $('form').submit(function() {
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// });
// socket.on('chat message', function(msg) {
//   $('#messages').append($('<li>').text(msg));
// });

var InMemoryContainer = require('../../../lib/containers/InMemoryContainer');
var WebSocketConnector = require('../../../lib/connectors/WebSocketConnector');

// Create a new container for objects
var container = new InMemoryContainer('browserinmem');
new WebSocketConnector(socket, container);

// Add an object
container.add({source: 'browser', data: [0,1,2]}, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('ok');
  }
});

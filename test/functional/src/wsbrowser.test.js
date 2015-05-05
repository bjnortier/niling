var io = require('socket.io-client');
var $  = require('jquery');
console.log(io);

var socket = io();
$('form').submit(function() {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg) {
  $('#messages').append($('<li>').text(msg));
});

var InMemoryContainer = require('../../../lib/containers/InMemoryContainer');

// Create a new container for objects
var container = new InMemoryContainer('inmem');

// Add an object
container.add({a: 1, b:2, c: 3}, function(err) {
  if (err) {
    console.error(err);
  }
});

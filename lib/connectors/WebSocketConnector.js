var ee = require('event-emitter');
var bson = require('bson');
var BSON = (bson.BSONPure && bson.BSONPure.BSON) || bson.BSON;

function WebSocketConnector(socket, container) {
  ee(this);

  var _this = this;

  container.on('added', function(hash, object, bson) {
    socket.emit('added', {hash: hash, bson: bson});
  });

  socket.on('added', function(msg) {
    var hash = msg.hash;
    // Received from server: msg.bson
    // Received from client: msg.bson.data
    // console.log(msg);
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    // console.log('received deserialized object', object);
    var silent = true;
    container.add(object, silent, function(err, result) {
      if (err) {
        throw new Error(err);
      }
      var targetHash = result.hash;
      if (targetHash !== hash) {
        throw new Error('computed target hash for object not the same as source hash');
      }
      if (result.added) {
        _this.emit('synced', hash);
      }
    });
  });

}

module.exports = WebSocketConnector;
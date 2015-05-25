var ee = require('event-emitter');
var bson = require('bson');
var BSON = (bson.BSONPure && bson.BSONPure.BSON) || bson.BSON;

function WebSocketConnector(socket, container) {
  ee(this);

  var _this = this;

  container.on('put_obj', function(hash, object, bsonBuffer) {
    socket.emit('put_obj', {hash: hash, bson: bsonBuffer});
  });

  socket.on('put_obj', function(msg) {
    var hash = msg.hash;
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    
    container.putObject(object, {silent: true}, function(err, result) {
      if (err) {
        console.error(err);
      } else if (result.added) {
        _this.emit('synced', hash, {type: 'put_object'});
      }
    });
  });

  container.on('put_ref', function(key, version, object, bsonBuffer) {
    socket.emit('put_ref', {key: key, version: version, bson: bsonBuffer});
  });

  socket.on('put_ref', function(msg) {
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    
    container.putReference(msg.key, object, {silent: true}, function(err, result) {
      if (err) {
        console.error(err);
      } else if (result) {
        _this.emit('synced', msg.key);
      }
    });
  });

  container.on('update_ref', function(key, prevVsn, nextVsn, object, bsonBuffer) {
    socket.emit('update_ref', {key: key, prevVsn: prevVsn, nextVsn: nextVsn, bson: bsonBuffer});
  });

  socket.on('update_ref', function(msg) {
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    
    container.updateReference(msg.key, object, msg.prevVsn, {silent: true}, function(err, result) {
      if (err) {
        console.error(err);
      } else if (result) {
        _this.emit('synced', msg.key);
      }
    });
  });

}

module.exports = WebSocketConnector;
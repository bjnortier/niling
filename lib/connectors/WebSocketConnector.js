var ee = require('event-emitter');
var bson = require('bson');
var BSON = (bson.BSONPure && bson.BSONPure.BSON) || bson.BSON;

function WebSocketConnector(socket, container) {
  ee(this);

  var _this = this;

  container.on('put_obj', function(hash, object, bsonBuffer) {
    socket.emit('put_obj', {
      hash: hash,
      bson: bsonBuffer,
      source: container.name,
    });
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
    var from = msg.source;
    var to = container.name;
    
    container.putObject(object, {silent: true}, function(err) {
      if (err) {
        console.error('niling:', err);
      } else {
        _this.emit('synced', from, to, {type: 'put_obj', hash: hash});
      }
    });
  });

  container.on('pull_obj', function(hash) {
    socket.emit('pull_obj', hash);
  });

  socket.on('pull_obj', function(ref) {
    container.emitObject(ref, function(err) {
      if (err) {
        console.error('niling:', err);
      }
    });
  });

  container.on('emit_obj', function(hash, object, bsonBuffer) {
    socket.emit('put_obj', {
      hash: hash,
      bson: bsonBuffer,
      source: container.name,
    });
  }); 

  container.on('put_ref', function(key, version, object, bsonBuffer) {
    socket.emit('put_ref', {
      key: key,
      version: version,
      bson: bsonBuffer,
      source: container.name,
    });
  });

  socket.on('put_ref', function(msg) {
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    var from = msg.source;
    var to = container.name;
    
    container.putReference(msg.key, object, {silent: true}, function(err, result) {
      if (err) {
        console.error('niling:', err);
      } else if (result) {
        _this.emit('synced', from, to, {type: 'put_ref', key: msg.key});
      }
    });
  });

  container.on('update_ref', function(key, prevVsn, nextVsn, object, bsonBuffer) {
    socket.emit('update_ref', {
      key: key,
      prevVsn: prevVsn,
      nextVsn: nextVsn,
      bson: bsonBuffer,
      source: container.name,
    });
  });

  socket.on('update_ref', function(msg) {
    var deserializeInput;
    if (msg.bson.data) {
      deserializeInput = msg.bson.data;
    } else {
      deserializeInput = new Uint8Array(msg.bson);
    }
    var object = BSON.deserialize(deserializeInput);
    var from = msg.source;
    var to = container.name;
    
    container.updateReference(msg.key, object, msg.prevVsn, {silent: true}, function(err, result) {
      if (err) {
        console.error('niling:', err);
      } else if (result) {
        _this.emit('synced', from, to, {type: 'update_ref', key: msg.key});
      }
    });
  });

  container.on('pull_ref', function(key) {
    socket.emit('pull_ref', key);
  });

  socket.on('pull_ref', function(ref) {
    container.emitReference(ref, function(err) {
      if (err) {
        console.error('niling:', err);
      }
    });
  });

  container.on('emit_ref', function(key, version, object, bsonBuffer) {
    socket.emit('put_ref', {
      key: key,
      version: version,
      bson: bsonBuffer,
      source: container.name,
    });
  }); 

}

module.exports = WebSocketConnector;
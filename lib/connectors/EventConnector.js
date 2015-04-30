var ee = require('event-emitter');

function EventConnector(a, b) {
  ee(this);

  var _this = this;

  a.on('added', function(hash, object) {
    var result = b.add(object);
    var targetHash = result.hash;
    if (targetHash !== hash) {
      throw new Error('computed target hash for object not the same as source hash');
    }
    if (result.added) {
      _this.emit('synced', a.name, b.name, hash);
    }
  });

  b.on('added', function(hash, object) {
    var result = a.add(object);
    var targetHash = result.hash;
    if (targetHash !== hash) {
      throw new Error('computed target hash for object not the same as source hash');
    }
    if (result.added) {
      _this.emit('synced', b.name, a.name, hash);
    }
  });
}

module.exports = EventConnector;
var ee = require('event-emitter');

function EventConnector(a, b) {
  ee(this);

  var _this = this;


  a.on('added', function(hash, object) {
    var silent = true;
    b.add(object, silent, function(err, result) {
      if (err) {
        throw new Error(err);
      }
      var targetHash = result.hash;
      if (targetHash !== hash) {
        throw new Error('computed target hash for object not the same as source hash');
      }
      if (result.added) {
        _this.emit('synced', a.name, b.name, hash);
      }
    });
  });

  b.on('added', function(hash, object) {
    var silent = true;
    a.add(object, silent, function(err, result) {
      if (err) {
        throw new Error(err);
      }
      var targetHash = result.hash;
      if (targetHash !== hash) {
        throw new Error('computed target hash for object not the same as source hash');
      }
      if (result.added) {
        _this.emit('synced', b.name, a.name, hash);
      }
    });
  });
}

module.exports = EventConnector;
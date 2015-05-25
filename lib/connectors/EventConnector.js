var ee = require('event-emitter');

function EventConnector(a, b) {
  ee(this);

  var _this = this;

  function createPutObjSync(from, to) {
    from.on('put_obj', function(hash, object) {
      to.putObject(object, {silent: true}, function(err, result) {
        if (err) {
          throw new Error(err);
        }      if (result.added) {
          _this.emit('synced', from.name, to.name, hash);
        }
      });
    });
  }

  createPutObjSync(a, b);
  createPutObjSync(b, a);
  
  function createPutRefSync(from, to) {
    from.on('put_ref', function(ref, version, object) {
      to.putReference(ref, object, {silent: true}, function(err) {
        if (err) {
          throw new Error(err);
        }
        _this.emit('synced', from.name, to.name, ref);
      });
    });
  }

  createPutRefSync(a, b);
  createPutRefSync(b, a);

  function createUpdateRefSync(from, to) {
    from.on('update_ref', function(ref, prevVsn, nextVsn, object) {
      to.updateReference(ref, object, prevVsn, {silent: true}, function(err) {
        if (err) {
          throw new Error(err);
        }
        _this.emit('synced', from.name, to.name, ref);
      });
    });
  }

  createUpdateRefSync(a, b);
  createUpdateRefSync(b, a);
}

module.exports = EventConnector;
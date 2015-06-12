function InMemoryStore() {

  var objects = {};
  var references = {};

  this.init = function(callback) {
    callback(null);
  };

  this.close = function(callback) {
    callback(null);
  };

  this.putObject = function(key, value, callback) {
    if (!objects.hasOwnProperty(key)) {
      objects[key] = value;
      callback(null, true /* added */);
    } else {
      callback(null, false /* added */);
    }
  };

  this.getObject = function(key, callback) {
    callback(null, objects[key]);
  };

  this.putReference = function(key, value, version, callback) {
    if (references.hasOwnProperty(key)) {
      callback('reference with key "' + key + '" exists');
    } else {
      references[key] = {
        value: value,
        version: version,
      };
      callback(null);
    }
  };

  this.updateReference = function(key, value, prevVsn, newVsn, callback) {
    var previous = references[key];
    if (!previous) {
      callback('reference "' + key + '" doesn\'t exist');
    } else {
      if (previous.version !== prevVsn) {
        callback('wrong version for updating reference "' + key + '"');
      } else {
        references[key] = {
          value: value,
          version: newVsn,
        };
        callback(null);
      }
    }
  };

  this.deleteReference = function(key, version, callback) {
    var previous = references[key];
    if (!previous) {
      callback('cannot delete non-existing reference "' + key + '"');
    } else if (previous.version !== version) {
      callback('wrong version for deleting reference "' + key + '"');
    } else {
      delete references[key];
      callback(null);
    }
  };

  this.getReference = function(key, callback) {
    var current = references[key];
    if (!current) {
      callback(null, undefined);
    } else {
      callback(null, current.value, current.version);
    }
  };

}

module.exports = InMemoryStore;


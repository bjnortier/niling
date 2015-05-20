
function InMemoryStore() {
  this.objects = {};
  this.references = {};
}

InMemoryStore.prototype.putObject = function(key, value, callback) {
  if (!this.objects.hasOwnProperty(key)) {
    this.objects[key] = value;
    callback(null, true /* added */);
  } else {
    callback(null, false /* added */);
  }
};

InMemoryStore.prototype.getObject = function(key, callback) {
  callback(null, this.objects[key]);
};

InMemoryStore.prototype.putReference = function(key, value, version, callback) {
  if (this.references.hasOwnProperty(key)) {
    callback('reference with key "' + key + '" exists');
  } else {
    this.references[key] = {
      value: value,
      version: version,
    };
    callback(null);
  }
};

InMemoryStore.prototype.updateReference = function(key, value, prevVsn, newVsn, callback) {
  var previous = this.references[key];
  if (!previous) {
    callback('reference "' + key + '" doesn\'t exist');
  } else {
    if (previous.version !== prevVsn) {
      callback('wrong version for updating reference "' + key + '"');
    } else {
      this.references[key] = {
        value: value,
        version: newVsn,
      };
      callback(null);
    }
  }
};

InMemoryStore.prototype.getReference = function(key, callback) {
  var current = this.references[key];
  if (!current) {
    callback(null, undefined);
  } else {
    callback(null, current.value, current.version);
  }
};

module.exports = InMemoryStore;


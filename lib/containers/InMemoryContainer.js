var Container = require('./Container');

function InMemoryContainer(name) {
  Container.call(this, name);

  // The in-memory object store
  this.inMemory = {};
}

InMemoryContainer.prototype = Object.create(Container.prototype);

// Called by Container.add
InMemoryContainer.prototype.addToStore = function(hash, object, bson, callback) {
  if (!this.inMemory.hasOwnProperty(hash)) {
    this.inMemory[hash] = bson;
    callback(null, true /* added */);
  } else {
    callback(null, false /* added */);
  }
};

InMemoryContainer.prototype.exists = function(key, callback) {
  var exists = this.inMemory.hasOwnProperty(key);
  callback(null, exists);
};

InMemoryContainer.prototype.put = function(key, object, bson, callback) {
  if (!this.inMemory.hasOwnProperty(key)) {
    this.inMemory[key] = bson;
    callback(null, true /* added */);
  } else {
    callback(null, false /* added */);
  }
};

/**
 * Get a value
 * 
 * @param {string} key the key
 */
InMemoryContainer.prototype.get = function(key, callback) {
  return callback(null, this.inMemory[key]);
};


module.exports = InMemoryContainer;
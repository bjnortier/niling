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
    this.inMemory[hash] = object;
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = InMemoryContainer;
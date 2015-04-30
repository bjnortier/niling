var Container = require('./Container');

function InMemoryContainer(name) {
  Container.call(this, name);

  // The in-memory object store
  this.inMemory = {};
}

InMemoryContainer.prototype = Object.create(Container.prototype);

// Called by Container.add
InMemoryContainer.prototype.addToStore = function(hash, object) {
  if (!this.inMemory.hasOwnProperty(hash)) {
    this.inMemory[hash] = object;
    return true;
  } else {
    return false;
  }
};

module.exports = InMemoryContainer;
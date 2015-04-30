var ee = require('event-emitter');

var hashFn = require('../hash');

function Container(name) {
  ee(this);

  // Name is for reporting
  if (name === undefined) {
    throw new Error('no name for container');
  }
  this.name = name;
}

Container.prototype.add = function(object) {

  var hash = hashFn(object);
  var added = this.addToStore(hash, object);
  if (added) {
    this.emit('added', hash, object);
  } 
  return {hash: hash, added: added};
};

module.exports = Container;
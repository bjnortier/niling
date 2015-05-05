var ee = require('event-emitter');

var serialize = require('../serialize');

function Container(name) {
  ee(this);

  // Name is for reporting
  if (name === undefined) {
    throw new Error('no name for container');
  }
  this.name = name;
}

Container.prototype.add = function(object, callback) {

  var serialized = serialize(object);
  var hash = serialized.hash;
  var bson = serialized.bson;
  var _this = this;
  this.addToStore(hash, object, bson, function(err, added) {
    if (err) {
      callback(err);
    }
    if (added) {
      _this.emit('added', hash, object);
    } 
    callback(null, {hash: hash, added: added});
  });
};

module.exports = Container;
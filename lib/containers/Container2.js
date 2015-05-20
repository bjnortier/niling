var ee = require('event-emitter');

var serialize = require('../serialize');

function Container(name, store) {
  ee(this);

  // Name is for reporting
  if (name === undefined) {
    throw new Error('no name for container');
  }
  this.name = name;
  this.store = store;
}

/**
 * Put an object in the container
 * 
 * @param object The object to add to the container
 * @param options options like whether it should be silent (no 'put' event emitted)
 * @param callback the callback if no silent flag is provided
 */
Container.prototype.putObject = function(object, options, callback) {
  var silent = !!options.silent;
  var serialized = serialize(object);
  var hash = serialized.hash;
  var bson = serialized.bson;
  var _this = this;
  this.store.putObject(hash, object, bson, function(err, added) {
    if (err) {
      callback(err);
    }
    if (added && !silent) {
      _this.emit('added', hash, object, bson);
    } 
    callback(null, {hash: hash, added: added});
  });
};
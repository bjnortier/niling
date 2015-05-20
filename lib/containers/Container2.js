var ee = require('event-emitter');

var bson = require('../bson');

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
 * This callback type is called `requestCallback`
 *
 * @callback requestCallback
 * @param {string} error
 * @param {string} result
 */

/**
 * Put an object in the container
 * 
 * @param object {Object} The object to add to the container
 * @param options {Object} options like whether it should be silent (no 'put' event emitted)
 * @param callback {requestCallback} the callback
 */
Container.prototype.putObject = function(object, options, callback) {
  var silent = !!options.silent;
  var serialized = bson.serialize(object);
  var hash = serialized.hash;
  var bsonBuffer = serialized.bson;
  var _this = this;
  this.store.putObject(hash, bsonBuffer, function(err, added) {
    if (err) {
      callback(err);
    }
    if (added && !silent) {
      _this.emit('put', hash, object, bsonBuffer);
    } 
    callback(null, {hash: hash, added: added});
  });
};

/**
 * Get an object from the container
 * 
 * @param hash {string} The hash of the object
 * @param callback {requestCallback} the callback
 */
Container.prototype.getObject = function(hash, callback) {
  this.store.getObject(hash, function(err, bsonBuffer) {
    if (err) {
      callback(err);
    } else {
      callback(null, bson.deserialize(bsonBuffer));
    }
  });
};

module.exports = Container;
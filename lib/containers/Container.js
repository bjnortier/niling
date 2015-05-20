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

/**
 * Add an object to the container
 * 
 * @param object The object to add to the container
 * @param options options like whether an 'added' event should be emitted (silent)
 * @param callback the callback if no silent flag is provided
 */
Container.prototype.addObject = function(object, options, callback) {
  var silent = !!options.silent;
  var serialized = serialize(object);
  var hash = serialized.hash;
  var bson = serialized.bson;
  var _this = this;
  this.addToStore(hash, object, bson, function(err, added) {
    if (err) {
      callback(err);
    }
    if (added && !silent) {
      _this.emit('added', hash, object, bson);
    } 
    callback(null, {hash: hash, added: added});
  });
};

// References may not be confused with hashes, so
// must contains other types of characters, e.g. '_master'
Container.validateReference = function(reference) {
  return !/^[0-9a-f]+$/.exec(reference);
};

/**
 * Create a new reference. 
 *
 * References are mutable, like git references.
 */
Container.prototype.createRef = function(ref, object, options, callback) {
  if (!Container.validateReference(ref)) {
    return callback('invalid reference');
  }

  var _this = this;
  this.exists(ref, function(err, exists) {
    if (err) {
      return callback(err);
    } else if (exists) {
      return callback('already exists: "' + ref + '"');
    } else {
      var silent = !!options.silent;
      var serialized = serialize(object);
      var hash = serialized.hash;
      var bson = serialized.bson;
      _this.put(ref, object, bson, function(err, added) {
        if (err) {
          callback(err);
        }
        if (added && !silent) {
          _this.emit('added', ref, object, bson);
        } 
        callback(null, {hash: hash, added: added});
      });
    }
  });
};

// };

/**
 * Update a reference
 * 
 * Since references are mutable, the previous hash
 * of a reference must be supplied in order to update 
 * it (similar to CouchDB).
 */
// Container.prototype.updateRef = function(ref, object, previous, options, callback) {
//   if (!Container.validateReference(ref)) {
//     return callback('invalid reference');
//   }

//   var _this = this;
//   this.get(ref, function(err, value) {
    
//   });
// };

module.exports = Container;
var ee = require('event-emitter');
var async = require('async');
var bson = require('../bson');

/** 
 * A Container wraps a Store object, handling the BSON serialisation
 * hash generation, and event emitting
 */
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
    } else {
      if (added && !silent) {
        _this.emit('put_obj', hash, object, bsonBuffer);
      } 
      callback(null, {hash: hash, added: added});
    }
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
    } else if (bsonBuffer === undefined) {
      callback(null, undefined);
    } else {
      callback(null, bson.deserialize(bsonBuffer));
    }
  });
};

Container.prototype.pullObject = function(hash) {
  this.emit('pull_obj', hash);
};

Container.prototype.emitObject = function(hash, callback) {
  var _this = this;
  async.waterfall([
    function(cb) { _this.getObject(hash, cb); },
    function(object, cb) {
      if (object === undefined) {
        cb('no such object to emit ' + hash);
      } else {
        var serialized = bson.serialize(object);
        var bsonBuffer = serialized.bson;
        _this.emit('emit_obj', hash, object, bsonBuffer);
        cb(null);
      }
    },
  ], callback);
};


/**
 * Put a reference. The version of the reference
 * is the hash of the reference object. In this way, to update the reference
 * the updater must know the current reference object.
 * 
 * @param key {string} The reference key
 * @param object {Object} The object to add to the container
 * @param options {Object} options like whether it should be silent (no 'put' event emitted)
 * @param callback {requestCallback} the callback
 */
Container.prototype.putReference = function(key, object, options, callback) {
  var silent = !!options.silent;
  var serialized = bson.serialize(object);
  var version = serialized.hash;
  var bsonBuffer = serialized.bson;
  var _this = this;
  this.store.putReference(key, bsonBuffer, version, function(err) {
    if (err) {
      callback(err);
    } else {
      if (!silent) {
        _this.emit('put_ref', key, version, object, bsonBuffer);
      } 
      callback(null, {version: version});
    }
  });
};


/**
 * Update a reference. The previous version must be provided
 * to make conflicts explicit.
 * 
 * @param key {string} The reference key
 * @param object {Object} The object to add to the container
 * @param prevVsn {prevVsn} The previous version
 * @param options {Object} options like whether it should be silent (no 'put' event emitted)
 * @param callback {requestCallback} the callback
 */
Container.prototype.updateReference = function(key, object, prevVsn, options, callback) {
  var silent = !!options.silent;
  var serialized = bson.serialize(object);
  var nextVsn = serialized.hash;
  var bsonBuffer = serialized.bson;
  var _this = this;
  this.store.updateReference(key, bsonBuffer, prevVsn, nextVsn, function(err) {
    if (err) {
      callback(err);
    } else {
      if (!silent) {
        _this.emit('update_ref', key, prevVsn, nextVsn, object, bsonBuffer);
      } 
      callback(null, {version: nextVsn});
    }
  });
};

/**
 * Get a reference from the container
 * 
 * @param key {string} The key of the reference
 * @param callback {requestCallback} the callback
 */
Container.prototype.getReference = function(key, callback) {
  this.store.getReference(key, function(err, bsonBuffer, version) {
    if (err) {
      callback(err);
    } else if (bsonBuffer === undefined) {
      callback(null);
    } else {
      callback(null, bson.deserialize(bsonBuffer), version);
    }
  });
};

/**
 * Delete a reference from the container.
 * 
 * @param key {string} The key of the reference
 * @param version {string} The version of the reference
 * @param callback {requestCallback} the callback
 */
Container.prototype.deleteReference = function(key, version, callback) {
  this.store.deleteReference(key, version, callback);
};

Container.prototype.pullReference = function(key) {
  this.emit('pull_ref', key);
};

Container.prototype.emitReference = function(key, callback) {
  var _this = this;
  async.waterfall([
    function(cb) { _this.getReference(key, cb); },
    function(object, version, cb) {
      if (object === undefined) {
        cb('no such reference to emit');
      } else {
        console.log('3', object);
        var serialized = bson.serialize(object);
        var bsonBuffer = serialized.bson;
        _this.emit('emit_ref', key, version, object, bsonBuffer);
        cb(null);
      }
    },
  ], callback);
};

module.exports = Container;
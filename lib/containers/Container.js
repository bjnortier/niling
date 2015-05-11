var ee = require('event-emitter');
var isBoolean = require('lodash.isboolean');

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
 * @param silentOrCallback a boolean for performing a silent add
 * or the callback
 * @param callback the callback if no silent flag is provided
 */
Container.prototype.add = function(object, silentOrCallback, callbackIfNoFlag) {
  var silent = isBoolean(silentOrCallback) ? silentOrCallback : false;
  var callback = (callbackIfNoFlag === undefined) ? silentOrCallback : callbackIfNoFlag;
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

module.exports = Container;
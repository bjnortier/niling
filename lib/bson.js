var sha1 = require('sha1');
var bson = require('bson');
var BSON = (bson.BSONPure && bson.BSONPure.BSON) || bson.BSON;

var isArray = require('lodash.isarray');
var isObject = require('lodash.isobject');
var keys = require('lodash.keys');

function normalize(obj) {
  if (isArray(obj)) {
    return obj.map(function(x) {
      return normalize(x);
    });
  } else if (isObject(obj)) {
    var sortedKeys = keys(obj).sort();
    var newObj = {};
    sortedKeys.forEach(function(key) {
      newObj[key] = normalize(obj[key]);
    });
    return newObj;
  } else {
    return obj;
  }
}

module.exports.serialize = function(object) {
  var serialized = BSON.serialize(normalize(object), false);
  return {
    hash: sha1(serialized),
    bson: serialized,
  };
};

module.exports.deserialize = function(object) {
  return BSON.deserialize(object);
};
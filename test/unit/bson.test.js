var chai = require('chai');
var assert = chai.assert;

var bson = require('../../lib/bson');

describe('S11N', function() {

  it('produces the same hash for differently ordered objects', function() {

    var a = {foo: 1, bar: 'baz'};
    var b = {bar: 'baz', foo: 1};
    var c = {};

    assert.notEqual(bson.serialize(a).hash, bson.serialize(c).hash);
    assert.equal(bson.serialize(a).hash, bson.serialize(b).hash);
  });

  it('can serialize and deserialize', function() {

    var a = {foo: 1, bar: 'baz'};
    var b = bson.deserialize(bson.serialize(a).bson);
    assert.deepEqual(b, a);
  });

});
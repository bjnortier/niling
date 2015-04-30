var chai = require('chai');
var assert = chai.assert;

var hash = require('../../lib/hash');

describe('Hashing', function() {

  it('produces the same hash for differently ordered objects', function() {

    var a = {foo: 1, bar: 'baz'};
    var b = {bar: 'baz', foo: 1};
    var c = {};

    assert.notEqual(hash(a), hash(c));
    assert.equal(hash(a), hash(b));
  });

});
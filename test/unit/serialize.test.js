var chai = require('chai');
var assert = chai.assert;

var serialize = require('../../lib/serialize');

describe('S11N', function() {

  it('produces the same hash for differently ordered objects', function() {

    var a = {foo: 1, bar: 'baz'};
    var b = {bar: 'baz', foo: 1};
    var c = {};

    assert.notEqual(serialize(a).hash, serialize(c).hash);
    assert.equal(serialize(a).hash, serialize(b).hash);
  });

});
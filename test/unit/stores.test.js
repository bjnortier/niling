var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var InMemoryStore = require('../../lib/stores/InMemoryStore');

describe.only('Stores', function() {

  var store;
  beforeEach(function() {
    store = new InMemoryStore();
  });
  
  it('can put/get objects', function(done) {
    async.series([
      function(cb) {
        store.putObject('abd', {foo: [1,2,3]}, cb);
      },
      function(cb) {
        store.getObject('abd', cb);
      },
    ], function(err, result) {
      assert.isUndefined(err);
      assert.deepEqual(result, [true, {foo: [1,2,3]}]);
      done();
    });
  });

  it('can put, update and get references', function(done) {
    async.series([
      function(cb) {
        store.putReference('abd', {foo: [1,2,3]}, 0, cb);
      },
      function(cb) {
        store.getReference('abd', cb);
      },
      function(cb) {
        store.updateReference('abd', {bar: []}, 0, 1, cb);
      },
      function(cb) {
        store.getReference('abd', cb);
      },
    ], function(err, result) {
      assert.isUndefined(err);
      assert.deepEqual(result, [
        undefined, 
        [{foo: [1,2,3]}, 0],
        undefined, 
        [{bar: []}, 1],
      ]);
      done();
    });
  });

  it('cannot put a reference when one exists', function(done) {
    async.series([
      function(cb) {
        store.putReference('abd', {foo: [1,2,3]}, 0, cb);
      },
      function(cb) {
        store.putReference('abd', {foo: [1,2,3]}, 0, cb);
      },
    ], function(err) {
      assert.equal(err, 'reference with key "abd" exists');
      done();
    });
  });

  it('cannot update a non-existing reference', function(done) {
    async.series([
      function(cb) {
        store.updateReference('abd', {bar: [4]}, 1, 2, cb);
      },
    ], function(err) {
      assert.equal(err, 'reference "abd" doesn\'t exist');
      done();
    });
  });

  it('must update a reference with the previous version', function(done) {
    async.series([
      function(cb) {
        store.putReference('abd', {foo: [1,2,3]}, 0, cb);
      },
      function(cb) {
        store.updateReference('abd', {bar: [4]}, 1, 2, cb);
      },
    ], function(err) {
      assert.equal(err, 'wrong version for updating reference "abd"');
      done();
    });
  });

});
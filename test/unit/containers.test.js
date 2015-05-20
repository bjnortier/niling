var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var Container = require('../../lib/containers/Container');
var lib = require('../..');
var InMemoryContainer = lib.containers.InMemoryContainer;

describe('__', function() {

  it('can validate references', function() {
    assert.isFalse(Container.validateReference('0123456789abcdef'));
    assert.isTrue(Container.validateReference('_master'));
    assert.isTrue(Container.validateReference('_0123456789abcdef'));
  });

  it('cannot create/update invalid references', function() {
    var a = new InMemoryContainer('inmem');

    // Transform the async callback into a valid callback so
    // all errors are collected
    function collectErr(cb) {
      return function(err) {
        cb(null, err);
      };
    }
    async.parallel([
      function(cb) {
        a.createRef('abc', {}, {}, collectErr(cb));
      },
      function(cb) {
        a.createRef('123', {}, {}, collectErr(cb));
      },
    ], function(err, results) {
      assert.isUndefined(err);
      assert.deepEqual(results, ['invalid reference', 'invalid reference']);
    });

  });

  it('can create new references', function(done) {
    var a = new InMemoryContainer('inmem');

    a.createRef('_foo', {bar: [1,2,3]}, {}, function(err, result) {
      assert.isNull(err);
      assert.deepEqual(result, {
        added: true,
        hash: '2ac6d6f92a35a1c1f2961396d58f3dab17018c73',
      });

      a.createRef('_foo', {baz: null}, {}, function(err) {
        assert.equal(err, 'already exists: "_foo"');
        done();
      });
    });
  });

  it('can update references', function(done) {

    var a = new InMemoryContainer('inmem');

    a.createRef('_foo', {bar: [1,2,3]}, {}, function(err, result) {
      assert.isNull(err);
      assert.deepEqual(result, {
        added: true,
        hash: '2ac6d6f92a35a1c1f2961396d58f3dab17018c73',
      });

      a.updateRef(
        '_foo', 
        {baz: [4,5,6]}, 
        '2ac6d6f92a35a1c1f2961396d58f3dab17018c73',
        {}, function(err) {
          assert.isNull(err);
          done();
        });
    });

  });

  it('will throw error on put of existing object');

});
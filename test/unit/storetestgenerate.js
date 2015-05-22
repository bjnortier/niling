var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var bson = require('../../lib/bson');

module.exports = function(name, Ctor, options) {

  describe(name + 'Store', function() {

    // http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    function construct(constructor, options) {
      function F() {
        return constructor.call(this, options);
      }
      F.prototype = constructor.prototype;
      return new F();
    }

    var store;
    beforeEach(function(done) {
      store = construct(Ctor, options);
      if (store.init) {
        store.init(done);
      } else {
        done();
      }
    });

    afterEach(function(done) {
      if (store.close) {
        store.close(done);
      } else {
        done();
      }
    });

    it('can put/get objects', function(done) {
      async.series([
        function(cb) {
          store.putObject('abd', bson.serialize({foo: [1,2,3]}).bson, cb);
        },
        function(cb) {
          store.putObject('abd', bson.serialize({foo: [1,2,3]}).bson, cb);
        },
        function(cb) {
          store.getObject('abd', cb);
        },
      ], function(err, result) {
        assert.isUndefined(err);
        assert.equal(result.length, 3);
        assert.isTrue(result[0]);
        assert.isFalse(result[1]);
        assert.deepEqual(bson.deserialize(result[2]), {foo: [1,2,3]});
        done();
      });
    });

    it('can put, update and get references', function(done) {
      async.series([
        function(cb) {
          store.putReference('abd', bson.serialize({bar: [100]}).bson, 0, cb);
        },
        function(cb) {
          store.getReference('abd', cb);
        },
        function(cb) {
          store.updateReference('abd', bson.serialize({bar: []}).bson, 0, 1, cb);
        },
        function(cb) {
          store.getReference('abd', cb);
        },
      ], function(err, result) {
        assert.isUndefined(err);
        assert.equal(result.length, 4);

        assert.isUndefined(result[0]);
        assert.deepEqual(bson.deserialize(result[1][0]), {bar: [100]});
        assert.equal(result[1][1], 0);

        assert.isUndefined(result[2]);
        assert.deepEqual(bson.deserialize(result[3][0]), {bar: []});
        assert.equal(result[3][1], 1);
        done();
      });
    });

    it('cannot put a reference when one exists', function(done) {
      async.series([
        function(cb) {
          store.putReference('abd', bson.serialize({foo: [1,2,3]}).bson, 0, cb);
        },
        function(cb) {
          store.putReference('abd', bson.serialize({foo: []}).bson, 0, cb);
        },
      ], function(err) {
        assert.equal(err, 'reference with key "abd" exists');
        done();
      });
    });

    it('cannot update a non-existing reference', function(done) {
      async.series([
        function(cb) {
          store.updateReference('abd', bson.serialize({bar: [4]}).bson, 1, 2, cb);
        },
      ], function(err) {
        assert.equal(err, 'reference "abd" doesn\'t exist');
        done();
      });
    });

    it('must update a reference with the previous version', function(done) {
      async.series([
        function(cb) {
          store.putReference('abd', bson.serialize({foo: [1,2,3]}).bson, 0, cb);
        },
        function(cb) {
          store.updateReference('abd', bson.serialize({bar: [4]}).bson, 1, 2, cb);
        },
      ], function(err) {
        assert.equal(err, 'wrong version for updating reference "abd"');
        done();
      });
    });

  });

};
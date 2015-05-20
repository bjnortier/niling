var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var Container = require('../../lib/containers/Container2');
var InMemoryStore = require('../../lib/stores/InMemoryStore');

describe.only('Containers', function() {

  var container;
  beforeEach(function() {
    container = new Container('foo', new InMemoryStore());
  });

  it('can put/get and emits "put" on new object', function(done) {

    var puts = [];
    container.on('put', function(hash) {
      puts.push(hash);
    });

    async.series([
      function(cb) { container.putObject({x: '1'}, {}, cb); },
      function(cb) { container.putObject({x: '1'}, {}, cb); },
      function(cb) { container.putObject({y: '2'}, {silent: true}, cb); },
      function(cb) { container.getObject('5970a7eb0315e488324eb6692061aac23b1133a2', cb); },
    ], function(err, results) {
      assert.isUndefined(err);
      assert.deepEqual(results, [
        {
          'added': true,
          'hash': '5970a7eb0315e488324eb6692061aac23b1133a2',
        },
        {
          'added': false,
          'hash': '5970a7eb0315e488324eb6692061aac23b1133a2',
        },
        {
          'added': true,
          'hash': '461bb9003252acefc46bb732b46bee00946f57ef',
        },
        {
          'x': '1'
        }
      ]);
      assert.deepEqual(puts, ['5970a7eb0315e488324eb6692061aac23b1133a2']);
      done();
    });

  });

});
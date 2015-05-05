var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var lib = require('../..');
var InMemoryContainer = lib.containers.InMemoryContainer;
var SQLiteContainer = lib.containers.SQLiteContainer;
var EventConnector = lib.connectors.EventConnector;

describe('Containers', function() {

  it('can sync 2 InMemory containers with an event connector', function(done) {

    var a = new InMemoryContainer('a');
    var b = new InMemoryContainer('b');
    var connector = new EventConnector(a,b);

    var syncs = [];
    connector.on('synced', function(from, to, ref) {
      syncs.push([from, to, ref]);
    });

    async.series([
      function(cb) { a.add({foo: 'bar'}, cb); },
      function(cb) { b.add({foo: 'abcdef'}, cb); },
    ], function(err, results) {
      assert.isUndefined(err);
      var hash1 = results[0].hash;
      var hash2 = results[1].hash;
      assert.deepEqual(syncs, [['a', 'b', hash1], ['b', 'a', hash2]]);
      done();
    });

  });

  it.only('can sync InMemory and SQLite', function(done) {

    var a = new InMemoryContainer('a');
    var b = new SQLiteContainer('b');
    var connector = new EventConnector(a,b);

    var syncs = [];
    connector.on('synced', function(from, to, ref) {
      syncs.push([from, to, ref]);
    });

    async.series([
      function(cb) { a.add({foo: 'bar'}, cb); },
      function(cb) { b.add({foo: 'abcdef'}, cb); },
    ], function(err, results) {
      assert.isUndefined(err);
      var hash1 = results[0].hash;
      var hash2 = results[1].hash;
      assert.deepEqual(syncs, [['a', 'b', hash1], ['b', 'a', hash2]]);
      done();
    });

  });

});
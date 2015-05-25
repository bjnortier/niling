var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var EventConnector = require('../../lib/connectors/EventConnector');
var Container = require('../../lib/containers/Container');
var InMemoryStore = require('../../lib/stores/InMemoryStore');

describe('Connectors', function() {
  
  it('can sync objects in 2 InMemory containers with an event connector', function(done) {

    var a = new Container('a', new InMemoryStore());
    var b = new Container('b', new InMemoryStore());
    var connector = new EventConnector(a,b);

    var puts = [];
    a.on('put_obj', function(hash) {
      puts.push(hash);
    });
    b.on('put_obj', function(hash) {
      puts.push(hash);
    });

    var syncs = [];
    connector.on('synced', function(from, to, ref) {
      syncs.push([from, to, ref]);
    });

    async.series([
      function(cb) { a.putObject({foo: 'bar'}, {}, cb); },
      function(cb) { b.putObject({foo: 'abcdef'}, {}, cb); },
    ], function(err, results) {
      assert.isUndefined(err);
      var hash1 = results[0].hash;
      var hash2 = results[1].hash;
      assert.deepEqual(syncs, [['a', 'b', hash1], ['b', 'a', hash2]]);

      // Silent put when receiving from a connector
      assert.deepEqual(puts, [hash1, hash2]);
      done();
    });

  });

  it('can sync references in 2 InMemory containers with an event connector', function(done) {

    var a = new Container('a', new InMemoryStore());
    var b = new Container('b', new InMemoryStore());
    var connector = new EventConnector(a,b);

    var events = [];
    a.on('put_ref', function(hash) {
      events.push({put: hash});
    });
    b.on('put_ref', function(hash) {
      events.push({put: hash});
    });
    a.on('update_ref', function(hash) {
      events.push({update: hash});
    });
    b.on('update_ref', function(hash) {
      events.push({update: hash});
    });

    var syncs = [];
    connector.on('synced', function(from, to, ref) {
      syncs.push([from, to, ref]);
    });

    async.series([
      function(cb) { a.putReference('ref1', {foo: 'bar'}, {}, cb); },
      function(cb) { b.putReference('ref2', {bar: 'abcdef'}, {}, cb); },
      function(cb) { a.updateReference('ref1', {foo: '1234'}, 
        '16d698695c5590d089498da252447ebeeda16a5b', {}, cb); },
      function(cb) { b.updateReference('ref2', {bar: 'xxyy'}, 
        '716d9da2d022d08970af5ad37d9fd5828c15dc50', {}, cb); },
    ], function(err) {
      assert.isUndefined(err);
      assert.deepEqual(syncs, [
        ['a', 'b', 'ref1'], 
        ['b', 'a', 'ref2'],
        ['a', 'b', 'ref1'],
        ['b', 'a', 'ref2'],
      ]);

      // Silent put when receiving from a connector
      assert.deepEqual(events, [{put: 'ref1'}, {put: 'ref2'}, {update: 'ref1'}, {update: 'ref2'}]);
      done();
    });

  });

  // it('can sync InMemory and SQLite', function(done) {

  //   var a = new InMemoryContainer('inmem');
  //   var b = new SQLiteContainer('sqlite', ':memory:');
  //   var connector = new EventConnector(a,b);

  //   var syncs = [];
  //   connector.on('synced', function(from, to, ref) {
  //     syncs.push([from, to, ref]);
  //   });

  //   async.series([
  //     function(cb) { a.addObject({foo: 'bar'}, {}, cb); },
  //     function(cb) { b.addObject({foo: 'abcdef'}, {}, cb); },
  //   ], function(err, results) {
  //     assert.isUndefined(err);
  //     var hash1 = results[0].hash;
  //     var hash2 = results[1].hash;
  //     assert.deepEqual(syncs, [['inmem', 'sqlite', hash1], ['sqlite', 'inmem', hash2]]);
  //     done();
  //   });

  // });


});
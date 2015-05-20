var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;
var async = require('async');

var Container = require('../../lib/containers/Container');
var InMemoryStore = require('../../lib/stores/InMemoryStore');

describe('Containers', function() {

  var container;
  beforeEach(function() {
    container = new Container('foo', new InMemoryStore());
  });

  it('can put/get objects and emits "put_obj"', function(done) {

    var put_events = [];
    container.on('put_obj', function(hash) {
      put_events.push(hash);
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
        },
      ]);
      assert.deepEqual(put_events, ['5970a7eb0315e488324eb6692061aac23b1133a2']);
      done();
    });

  });

  it('can put/get/update references and emits "put_ref"', function(done) {

    var put_events = [];
    container.on('put_ref', function(key, hash) {
      put_events.push([key, hash]);
    });
    var update_events = [];
    container.on('update_ref', function(key, prev, next) {
      update_events.push([key, prev, next]);
    });

    async.series([
      function(cb) { 
        container.putReference('_design', {x: '1'}, {}, cb);
      },
      function(cb) { 
        container.getReference('_design', cb);
      },
      function(cb) { 
        container.updateReference('_design', {x: '2'}, 
          '5970a7eb0315e488324eb6692061aac23b1133a2', {}, cb);
      },
      function(cb) { 
        container.getReference('_design', cb); 
      },
    ], function(err, results) {
      assert.isUndefined(err);
      assert.deepEqual(results, [
        {
          'version': '5970a7eb0315e488324eb6692061aac23b1133a2',
        },
        {
          'x': '1',
        },
        {
          'version': '812c794d2549ade4fbf39866b474a2ea2ead88da',
        },
        {
          'x': '2'
        },
      ]);
      assert.deepEqual(put_events, [['_design', '5970a7eb0315e488324eb6692061aac23b1133a2']]);
      assert.deepEqual(update_events, [
        [
          '_design', 
          '5970a7eb0315e488324eb6692061aac23b1133a2', 
          '812c794d2549ade4fbf39866b474a2ea2ead88da'
        ]
      ]);
      done();
    });

  });

});
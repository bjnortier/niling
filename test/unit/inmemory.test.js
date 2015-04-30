var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;

var lib = require('../..');
var InMemoryContainer = lib.containers.InMemoryContainer;
var EventConnector = lib.connectors.EventConnector;

describe('In Memory Containers', function() {

  it('can sync with an event connector', function() {

    var a = new InMemoryContainer('a');
    var b = new InMemoryContainer('b');
    var connector = new EventConnector(a,b);

    var syncs = [];
    connector.on('synced', function(from, to, ref) {
      syncs.push([from, to, ref]);
    });

    var hash1 = a.add({foo: 'bar'}).hash;
    var hash2 = b.add({label: 'abcdef'}).hash;

    assert.deepEqual(syncs, [['a', 'b', hash1], ['b', 'a', hash2]]);

  });

});
var generate = require('./storetestgenerate.js');
var InMemoryStore = require('../../lib/stores/InMemoryStore');
generate('InMemory', InMemoryStore);
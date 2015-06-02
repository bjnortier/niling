var generate = require('./storetestgenerate.js');
var SQLiteStore = require('../../lib/stores/SQLiteStore');
generate('SQLite', SQLiteStore, {filename: ':memory:'});
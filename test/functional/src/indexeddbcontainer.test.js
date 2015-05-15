var async = require('async');

var IndexedDBContainer = require('../../../lib/containers/IndexedDBContainer');

var console = document.querySelector('#console');

var logger = {
  info: function(msg) {
    console.innerHTML += '<li class="info">' + msg + '</li>';
  },
  error: function(msg) {
    console.innerHTML += '<li class="error">' + msg + '</li>';
  },
};

var container = new IndexedDBContainer('indexeddb', 'foo4', logger);
async.series([
  function(cb) { 
    container.init(cb);
  },
  function(cb) {
    container.add({foo: 'bar'}, cb);
  },
], function(err) {
    if (err) {
      logger.error(err);
    }
  });

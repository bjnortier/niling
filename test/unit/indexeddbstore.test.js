if ((typeof window === 'object') && (typeof window.indexedDB === 'object')) {
  var generate = require('./storetestgenerate.js');
  var IndexedDBStore = require('../../lib/stores/IndexedDBStore');
  generate('IndexedDB', IndexedDBStore, {name: 'unittest', deleteFirst: true});
}
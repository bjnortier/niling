var Container = require('./Container');

function IndexedDBContainer(name, filename, logger) {
  Container.call(this, name);
  this.filename = filename;
  this.logger = logger;
}

IndexedDBContainer.prototype = Object.create(Container.prototype);

IndexedDBContainer.prototype.init = function(callback) {
  var _this = this;
  var filename = this.filename;
  var logger = this.logger;

  var req = window.indexedDB.open(filename, 1);
  req.onerror = function(event) {
    console.error(event);
    callback(event.target.errorCode);
  };
  req.onsuccess = function() {
    _this.db = req.result;
    logger.info('opened');
    callback(null);
  };
  req.onupgradeneeded = function(event) {
    var db = event.target.result;
    db.createObjectStore('objects');
    logger.info('object store created');
  };
};

// Called by Container.add
IndexedDBContainer.prototype.addToStore = function(hash, object, bson, callback) {
  var transaction = this.db.transaction(['objects'], 'readwrite');
  var objectStore = transaction.objectStore('objects');
  var r1 = objectStore.get(hash);
  r1.onerror = function(event) {
    callback(event.target.errorCode);
  };
  r1.onsuccess = function() {
    // Do something with the request.result!
    var added;
    if (r1.result) {
      added = false;
      callback(null, added);
    } else {
      var r2 = objectStore.put(bson, hash);
      r2.onerror = function(event) {
        callback(event.target.errorCode);
      };
      r2.onsuccess = function() {
        added = true;
        callback(null, added);
      };
    }
  };
};

module.exports = IndexedDBContainer;
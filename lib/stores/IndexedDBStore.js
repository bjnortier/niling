function IndexedDBStore(options) {
  var name = options.name;

  var _this = this;
  this.init = function(callback) {

    function openDB() {
      var req2 = window.indexedDB.open(name, 1);
      req2.onerror = function(event) {
        console.error(event);
        callback(event.target.errorCode);
      };
      req2.onsuccess = function() {
        _this.db = req2.result;
        callback(null);
      };
      req2.onupgradeneeded = function(event) {
        var db = event.target.result;
        db.createObjectStore('objects');
        db.createObjectStore('refs');
      };
    }

    if (options.deleteFirst) {
      var req1 = window.indexedDB.deleteDatabase(options.name);
      req1.onerror = function(event) {
        console.error(event);
        callback(event.target.errorCode);
      };
      req1.onblocked = function(event) {
        console.error(event);
        callback(event.target.errorCode);
      };
      req1.onsuccess = function() {
        openDB();
      };
    } else {
      openDB();
    }
    return this;
    
  };

  this.close = function(callback) {
    this.db.close();
    callback();
  };

  this.putObject = function(key, bson, callback) {
    var transaction = this.db.transaction(['objects'], 'readwrite');
    var objectStore = transaction.objectStore('objects');
    var r1 = objectStore.get(key);
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
        var r2 = objectStore.put(bson, key);
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

  this.getObject = function(key, callback) {
    var transaction = this.db.transaction(['objects'], 'readonly');
    var objectStore = transaction.objectStore('objects');
    var r1 = objectStore.get(key);
    r1.onerror = function(event) {
      callback(event.target.errorCode);
    };
    r1.onsuccess = function() {
      if (r1) {
        callback(null, r1.result);
      } else {
        callback(null);
      }
    };
  };

  this.putReference = function(key, bson, version, callback) {
    var transaction = this.db.transaction(['refs'], 'readwrite');
    var objectStore = transaction.objectStore('refs');
    var r1 = objectStore.get(key);
    r1.onerror = function(event) {
      callback(event.target.errorCode);
    };
    r1.onsuccess = function() {
      if (r1.result) {
        callback('reference with key "' + key + '" exists');
      } else {
        var r2 = objectStore.put({bson: bson, version: version}, key);
        r2.onerror = function(event) {
          callback(event.target.errorCode);
        };
        r2.onsuccess = function() {
          callback(null);
        };
      }
    };
  };

  this.updateReference = function(key, bson, prevVsn, nextVsn, callback) {
    var transaction = this.db.transaction(['refs'], 'readwrite');
    var objectStore = transaction.objectStore('refs');
    var r1 = objectStore.get(key);
    r1.onerror = function(event) {
      callback(event.target.errorCode);
    };
    r1.onsuccess = function() {
      // Do something with the request.result!
      if (r1.result === undefined) {
        callback('reference "' + key + '" doesn\'t exist');
      } else {
        if (r1.result.version !== prevVsn) {
          callback('wrong version for updating reference "' + key + '"');
        } else {
          var r2 = objectStore.put({bson: bson, version: nextVsn}, key);
          r2.onerror = function(event) {
            callback(event.target.errorCode);
          };
          r2.onsuccess = function() {
            callback(null);
          };
        }
      }
    };
  };

  this.getReference = function(key, callback) {
    var transaction = this.db.transaction(['refs'], 'readonly');
    var objectStore = transaction.objectStore('refs');
    var r1 = objectStore.get(key);
    r1.onerror = function(event) {
      callback(event.target.errorCode);
    };
    r1.onsuccess = function() {
      if (r1.result) {
        callback(null, r1.result.bson, r1.result.version);
      } else {
        callback(null);
      }
    };
  };

  this.deleteReference = function(key, version, callback) {
    var transaction = this.db.transaction(['refs'], 'readwrite');
    var objectStore = transaction.objectStore('refs');
    var r1 = objectStore.get(key);
    r1.onerror = function(event) {
      callback(event.target.errorCode);
    };
    r1.onsuccess = function() {
      // Do something with the request.result!
      if (r1.result === undefined) {
        callback('cannot delete non-existing reference "' + key + '"');
      } else {
        if (r1.result.version !== version) {
          callback('wrong version for deleting reference "' + key + '"');
        } else {
          var r2 = objectStore.delete(key);
          r2.onerror = function(event) {
            callback(event.target.errorCode);
          };
          r2.onsuccess = function() {
            callback(null);
          };
        }
      }
    };
  };

}

module.exports = IndexedDBStore;
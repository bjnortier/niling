var sqlite3 = require('sqlite3');

function SQLiteStore(options) {
  var db = new sqlite3.Database(options.filename);
  

  this.init = function(callback) {
    db.serialize(function() {
      db.run('CREATE TABLE objects (key VARCHAR(40), bson BLOB, PRIMARY KEY(key))', function(err) {
        if (err) {
          return callback(err);
        }
        db.run('CREATE TABLE refs ' + 
          '(key VARCHAR(40), bson BLOB, version VARCHAR(40), PRIMARY KEY(key))', function(err) {
          callback(err);
        });
      });
    });
    return this;
  };

  this.close = function(callback) {
    db.close(callback);
  };

  this.putObject = function(key, bson, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT COUNT(*) FROM objects WHERE key=?');
      stmt.get(key, function(err, result) {
        var exists = false;
        if ((err === null) && (result['COUNT(*)'] !== 0)) {
          exists = true;
        }

        if (!exists) {
          var stmt2 = db.prepare('INSERT INTO objects VALUES (?, ?)');
          stmt2.run(key, bson, function(err) {
            if (err) {
              callback(err);
            } else {
              var added = true;
              callback(null, added);
            }
          });
          stmt2.finalize();
        } else {
          var added = false;
          callback(null, added);
        }

      });
      stmt.finalize();
    });
  };

  this.getObject = function(key, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT bson FROM objects WHERE key=?');
      stmt.get(key, function(err, result) {
        if (err) {
          callback(err);
        } else if (!result) {
          callback(null);
        } else {
          callback(null, result.bson);
        }
      });
      stmt.finalize();
    });
  };

  this.putReference = function(key, bson, version, callback) {
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO refs VALUES (?, ?, ?)');
      stmt.run(key, bson, version, function(err) {
        if (err) {
          if (err.errno === 19) {
            callback('reference with key "' + key + '" exists'); 
          } else {
            callback(err);
          }
        } else {
          callback(null);
        }
      });
      stmt.finalize();
    });
  };

  this.updateReference = function(key, bson, prevVsn, newVsn, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT bson, version FROM refs WHERE key=?');
      stmt.get(key, function(err, result) {
        if (err) {
          callback(err);
        } else {
          if (result === undefined) {
            callback('reference "' + key + '" doesn\'t exist');
          } else {
            if (result.version !== String(prevVsn)) {
              callback('wrong version for updating reference "' + key + '"');
            } else {
              db.run('UPDATE refs SET bson=?, version=? WHERE key=?', 
                bson, newVsn, key, 
                function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null);
                  }
                });
            }
          }
        }
      });
      stmt.finalize();
    });
  };

  this.deleteReference = function(key, version, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT version FROM refs WHERE key=?');
      stmt.get(key, function(err, result) {
        if (err) {
          callback(err);
        } else {
          if (result === undefined) {
            callback('cannot delete non-existing reference "' + key + '"');
          } else {
            if (result.version !== String(version)) {
              callback('wrong version for deleting reference "' + key + '"');
            } else {
              db.run('DELETE FROM refs WHERE key=?', key,
                function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null);
                  }
                });
            }
          }
        }
      });
      stmt.finalize();
    });
  };

  this.getReference = function(key, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT bson, version FROM refs WHERE key=?');
      stmt.get(key, function(err, result) {
        if (err) {
          callback(err);
        } else if (result === undefined) {
          callback(null);
        } else {
          callback(null, result.bson, result.version);
        }
      });
      stmt.finalize();
    });
  };
}

module.exports = SQLiteStore;
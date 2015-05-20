var sqlite3 = require('sqlite3');

function SQLiteStore(filename) {
  var db = new sqlite3.Database(filename);
  db.serialize(function() {
    db.run('CREATE TABLE objects (key VARCHAR(40), bson BLOB, PRIMARY KEY(key))', function(err) {
      if (err) {
        console.error(err);
      }
    });
    db.run('CREATE TABLE refs ' + 
      '(key VARCHAR(40), bson BLOB, version VARCHAR(40), PRIMARY KEY(key))', function(err) {
      if (err) {
        console.error('2', err);
      }
    });
  });

  this.putObject = function(key, value, callback) {
    db.serialize(function() {
      var stmt = db.prepare('SELECT COUNT(*) FROM objects WHERE key=?');
      stmt.get(key, function(err, result) {
        var exists = false;
        if ((err === null) && (result['COUNT(*)'] !== 0)) {
          exists = true;
        }

        if (!exists) {
          var stmt2 = db.prepare('INSERT INTO objects VALUES (?, ?)');
          stmt2.run(key, value, function(err) {
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
        } else {
          callback(null, result.bson);
        }
      });
    });
  };

  this.putReference = function(key, value, version, callback) {
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO refs VALUES (?, ?, ?)');
      stmt.run(key, value, version, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
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
        } else {
          callback(null, result.bson, result.version);
        }
      });
    });
  };
}

module.exports = SQLiteStore;
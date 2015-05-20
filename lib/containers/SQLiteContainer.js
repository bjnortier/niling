var sqlite3 = require('sqlite3').verbose();

var Container = require('./Container');

function SQLiteContainer(name, filename) {
  Container.call(this, name);

  var db = new sqlite3.Database(filename);
  db.serialize(function() {
    db.run('CREATE TABLE objects (hash VARCHAR(40), bson BLOB, PRIMARY KEY(hash))', function(err) {
      if (err) {
        console.error('1', err);
      }
    });
  });

  this.db = db;
}

SQLiteContainer.prototype = Object.create(Container.prototype);

SQLiteContainer.prototype.addToStore = function(hash, object, bson, callback) {
  var db = this.db;
  db.serialize(function() {
    var stmt = db.prepare('SELECT COUNT(*) FROM objects WHERE hash=?');
    stmt.get(hash, function(err, result) {
      var exists = false;
      if ((err === null) && (result['COUNT(*)'] !== 0)) {
        exists = true;
      }

      if (!exists) {
        var stmt2 = db.prepare('INSERT INTO objects VALUES (?, ?)');
        stmt2.run(hash, bson, function(err) {
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

module.exports = SQLiteContainer;



var path = require('path');
var express = require('express');

var app = express();

app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));

var port = Number(process.env.PORT || 8000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
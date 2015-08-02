var express = require('express');
var expressSession = require('express-session');
var app = express();
var fs = require('fs');

var FLAKE_FILE = __dirname + '/times-flaked';

app.use(require('morgan')());

app.get('/', function (req, res) {
  res.send('<html><body><div id="home">Hello.</div></html></body>');
});

app.get('/flake/:timesToFlake', function (req, res, next) {
  var timesToFlake = req.params.timesToFlake;

  fs.readFile(FLAKE_FILE, function (err, buffer) {
    var timesFlaked;

    if (err && err.code === 'ENOENT') {
      timesFlaked = 1;
    } else {
      timesFlaked = parseInt(buffer.toString());
    }

    console.log('Flaked', timesFlaked, '/', timesToFlake);

    if (timesFlaked >= timesToFlake) {
      res.send('<div id="success">Success!</div>');
    } else {
      fs.writeFile(FLAKE_FILE, timesFlaked + 1, {flag: 'w'}, function (err) {
        if (err) {
          return next(err);
        }
        res.status(400);
        res.send('<div id="failure">Failure!</div>');
      });
    }
  });
});

module.exports = app;

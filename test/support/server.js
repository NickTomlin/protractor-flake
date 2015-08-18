// we keep this es6 for easier interop with bin files
var express = require('express');
var expressSession = require('express-session');
var app = express();
var fs = require('fs');

var FLAKE_FILE = __dirname + '/times-flaked';
var server = null;

app.use(function logMiddleware (req, res, next) {
  req.logger = function () {
    if (app.get('log')) {
      console.log.apply(console, arguments)
    }
  }

  next();
});

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

    req.logger('Flaked', timesFlaked, '/', timesToFlake);

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

module.exports = {
  listen: function (options, callback) {
    options = options || {};
    var port = options.port || '3000';

    if (options.shouldLog) {
      app.use(require('morgan')());
      app.set('log', true);
    }

    server = app.listen(port, function () {
      console.log('Test server listening at ', port);
      if (callback) { callback(); }
    });
  },
  close: function () {
    server.close();
  }
}

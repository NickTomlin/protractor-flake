'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _child_process = require('child_process');

require('core-js/shim');

var DEFAULT_OPTIONS = {
  maxAttempts: 3,
  protractorPath: './node_modules/protractor/bin/protractor',
  '--': []
};

exports['default'] = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments.length <= 1 || arguments[1] === undefined ? function noop() {} : arguments[1];

  var parsedOptions = Object.assign(DEFAULT_OPTIONS, options);
  var testAttempt = 1;

  function handleTestEnd(status) {
    if (status === 0) {
      callback(status);
    } else {
      if (++testAttempt <= options.maxAttempts) {
        console.log('re-running tests: test attempt ' + testAttempt);
        return startProtractor();
      }

      callback(status);
    }
  }

  function startProtractor() {
    var output = '';
    var protractor = (0, _child_process.spawn)(parsedOptions.protractorPath, parsedOptions['--'], { stdio: 'inherit' });

    protractor.stdout.on('data', function (buffer) {
      output = output + buffer.toString();
    });

    protractor.on('exit', function (status) {
      handleTestEnd(status, output);
    });
  }

  startProtractor();
};

module.exports = exports['default'];
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

exports['default'] = function (options, callback) {
  if (options === undefined) options = {};

  var parsedOptions = Object.assign(DEFAULT_OPTIONS, options);
  var testAttempt = 1;

  function handleTestEnd(status) {
    if (status === 0) {
      callback(status);
    } else {
      if (++testAttempt <= options['max-attempts']) {
        console.log('re-running tests: test attempt ' + testAttempt);
        return startProtractor();
      }

      callback(status);
    }
  }

  function startProtractor() {
    var protractor = (0, _child_process.spawn)(parsedOptions.protractorPath, parsedOptions['--'], { stdio: 'inherit' });

    protractor.on('exit', handleTestEnd);
  }

  startProtractor();
};

module.exports = exports['default'];
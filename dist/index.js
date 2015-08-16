'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

require('core-js/shim');

var _failedSpecParser = require('./failed-spec-parser');

var _failedSpecParser2 = _interopRequireDefault(_failedSpecParser);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

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

  function handleTestEnd(status, output) {
    if (status === 0) {
      callback(status);
    } else {
      if (++testAttempt <= options.maxAttempts) {
        var failedSpecs = (0, _failedSpecParser2['default'])(output);
        (0, _logger2['default'])('info', 're-running tests: test attempt ' + testAttempt + '\n');
        return startProtractor(failedSpecs);
      }

      callback(status);
    }
  }

  function startProtractor() {
    var specFiles = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var protractorArgs = parsedOptions['--'];
    var output = '';

    if (specFiles.length) {
      (0, _logger2['default'])('debug', 'Targeting spec files:\n');
      (0, _logger2['default'])('debug', specFiles.join('\n') + '\n');
      protractorArgs.push('--specs', specFiles.join(','));
    }

    var protractor = (0, _child_process.spawn)(parsedOptions.protractorPath, protractorArgs);

    protractor.stdout.on('data', function (buffer) {
      var text = buffer.toString();
      (0, _logger2['default'])('info', text);
      output = output + text;
    });

    protractor.on('exit', function (status) {
      handleTestEnd(status, output);
    });
  }

  startProtractor();
};

module.exports = exports['default'];
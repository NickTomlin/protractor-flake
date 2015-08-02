var spawn = require('child_process').spawn;

module.exports = function (options, callback) {
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
    // todo: make this path configurable or "smart"
    var protractor = spawn(
      options['protractor-path'],
      options['--'],
      {stdio: 'inherit'}
    );

    protractor.on('exit', handleTestEnd);
  }

  startProtractor();
}

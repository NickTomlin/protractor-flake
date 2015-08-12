import {spawn} from 'child_process';
import 'core-js/shim'

const DEFAULT_OPTIONS = {
  maxAttempts: 3,
  protractorPath:  './node_modules/protractor/bin/protractor',
  '--': []
};

export default function (options = {}, callback = function noop () {}) {
  let parsedOptions = Object.assign(DEFAULT_OPTIONS, options);
  let testAttempt = 1;

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
    let output = '';
    let protractor = spawn(
      parsedOptions.protractorPath,
      parsedOptions['--'],
      {stdio: 'inherit'}
    );

    protractor.stdout.on('data', (buffer) => {
      output = output + buffer.toString();
    });

    protractor.on('exit', function (status) {
      handleTestEnd(status, output)
    });
  }

  startProtractor();
}

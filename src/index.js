import {spawn} from 'child_process';
import 'core-js/shim'

const DEFAULT_OPTIONS = {
  maxAttempts: 3,
  protractorPath:  './node_modules/protractor/bin/protractor',
  '--': []
};

export default function (options = {}, callback) {
  let parsedOptions = Object.assign(DEFAULT_OPTIONS, options);
  let testAttempt = 1;

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
    var protractor = spawn(
      parsedOptions.protractorPath,
      parsedOptions['--'],
      {stdio: 'inherit'}
    );

    protractor.on('exit', handleTestEnd);
  }

  startProtractor();
}

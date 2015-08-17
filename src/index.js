import {spawn} from 'child_process';
import 'core-js/shim'
import failedSpecParser from './failed-spec-parser';
import log from './logger';

const DEFAULT_OPTIONS = {
  maxAttempts: 3,
  protractorPath:  'protractor',
  '--': []
};

export default function (options = {}, callback = function noop () {}) {
  let parsedOptions = Object.assign(DEFAULT_OPTIONS, options);
  let testAttempt = 1;

  function handleTestEnd(status, output) {
    if (status === 0) {
      callback(status);
    } else {
      if (++testAttempt <= parsedOptions.maxAttempts) {
        let failedSpecs = failedSpecParser(output);
        log('info', `re-running tests: test attempt ${testAttempt}\n`);
        return startProtractor(failedSpecs);
      }

      callback(status);
    }
  }

  function startProtractor(specFiles = []) {
    let protractorArgs = parsedOptions['--'];
    let output = '';

    if (specFiles.length) {
      log('debug','Targeting spec files:\n');
      log('debug', specFiles.join('\n') + '\n');
      protractorArgs.push('--specs', specFiles.join(','));
    }

    let protractor = spawn(
      parsedOptions.protractorPath,
      protractorArgs
    );

    protractor.stdout.on('data', (buffer) => {
      let text = buffer.toString();
      log('info', text);
      output = output + text;
    });

    protractor.on('exit', function (status) {
      handleTestEnd(status, output)
    });
  }

  startProtractor();
}

import {spawn} from 'child_process'
import {getParser} from './parsers'
import parseOptions from './parse-options'
import 'core-js/shim'
import log from './logger'

function filterArgs (protractorArgs) {
  protractorArgs = protractorArgs.filter((arg) => !/^--(suite|specs)=/.test(arg));
  ['--suite', '--specs'].forEach((item) => {
    let index = protractorArgs.indexOf(item)
    if (index !== -1) {
      protractorArgs.splice(index, 2)
    }
  })
  return protractorArgs
}

export default function (options = {}, callback = function noop () {}) {
  let testAttempt = 1
  let parsedOptions = parseOptions(options)
  let parser = getParser(parsedOptions.parser)
  let log_color = parsedOptions.logColor

  function handleTestEnd (status, output = '') {
    if (status === 0) {
      callback(status)
    } else {
      if (++testAttempt <= parsedOptions.maxAttempts) {
        log('info', `\nUsing ${parser.name} to parse output\n`)
        let failedSpecs = parser.parse(output)

        log('info', `Re-running tests: test attempt ${testAttempt}\n`, log_color)
        if (failedSpecs.length === 0) {
          log('info', '\nTests failed but no specs were found. All specs will be run again.\n\n', log_color)
        } else {
          log('info', 'Re-running the following test files:\n')
          log('info', failedSpecs.join('\n') + '\n', log_color)
        }
        return startProtractor(failedSpecs)
      }

      callback(status, output)
    }
  }

  function startProtractor (specFiles = []) {
    let output = ''
    let protractorArgs = [parsedOptions.protractorPath].concat(parsedOptions.protractorArgs)

    if (specFiles.length) {
      protractorArgs = filterArgs(protractorArgs)
      protractorArgs.push('--specs', specFiles.join(','))
    }

    let protractor = spawn(
      parsedOptions.nodeBin,
      protractorArgs,
      parsedOptions.protractorSpawnOptions
    )

    protractor.stdout.on('data', (buffer) => {
      let text = buffer.toString()
      log('info', text)
      output = output + text
    })

    protractor.stderr.on('data', (buffer) => {
      let text = buffer.toString()
      log('info', text)
      output = output + text
    })

    protractor.on('exit', function (status) {
      handleTestEnd(status, output)
    })
  }

  startProtractor()
}

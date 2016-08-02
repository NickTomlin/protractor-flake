import { spawn } from 'child_process'
import { resolve } from 'path'
import { getParser } from './parsers'
import 'core-js/shim'
import log from './logger'

const DEFAULT_PROTRACTOR_ARGS = []

const DEFAULT_OPTIONS = {
  nodeBin: 'node',
  maxAttempts: 3,
  protractorArgs: DEFAULT_PROTRACTOR_ARGS,
  parser: 'standard'
}

export default function (options = {}, callback = function noop () {}) {
  let parsedOptions = Object.assign(DEFAULT_OPTIONS, options)
  let testAttempt = 1

  function handleTestEnd (status, output = '') {
    if (status === 0) {
      callback(status)
    } else {
      if (++testAttempt <= parsedOptions.maxAttempts) {
        let parser = getParser(parsedOptions.parser)
        log('info', `Using ${parser.name} to parse output\n`)
        let failedSpecs = parser.parse(output)

        log('info', `Re-running tests: test attempt ${testAttempt}\n`)
        log('info', 'Re-running the following test files:\n')
        log('info', failedSpecs.join('\n') + '\n')
        return startProtractor(failedSpecs)
      }

      callback(status, output)
    }
  }

  function startProtractor (specFiles = []) {
    var protractorBinPath
    if (parsedOptions.protractorPath) {
      protractorBinPath = resolve(parsedOptions.protractorPath)
    } else {
      // '.../node_modules/protractor/lib/protractor.js'
      var protractorMainPath = require.resolve('protractor')
      // '.../node_modules/protractor/bin/protractor'
      protractorBinPath = resolve(protractorMainPath, '../../bin/protractor')
    }

    let protractorArgs = [protractorBinPath].concat(parsedOptions.protractorArgs)
    let output = ''

    if (specFiles.length) {
      protractorArgs = protractorArgs.filter((arg) => !/^--suite=/.test(arg))
      protractorArgs.push('--specs', specFiles.join(','))
    }

    let protractor = spawn(
      parsedOptions.nodeBin,
      protractorArgs,
      options.protractorSpawnOptions
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

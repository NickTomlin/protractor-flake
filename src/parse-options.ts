import {resolve} from 'path'
import Options from './options'
import chalk from 'chalk'
import * as fs from 'fs'

const DEFAULT_OPTIONS: Options = {
  nodeBin: 'node',
  maxAttempts: 3,
  protractorArgs: [],
  color: 'magenta',
  parser: 'standard',
}

function parseOptions (providedOptions: Options) {
  let options = Object.assign({}, DEFAULT_OPTIONS, providedOptions)

  // normalizing options.color to be a boolean or a color value
  if (!(options.color in chalk)) {
    if (options.color.toString() === 'false') {
      options.color = false
    } else {
      throw new Error('Invalid color option. Color must be one of the supported chalk colors: https://github.com/chalk/ansi-styles#colors')
    }
  }

  if (options.protractorRetryConfig) {
    let configPath = resolve(options.protractorRetryConfig)
    try {
      fs.lstatSync(configPath).isFile()
      options.protractorRetryConfig = configPath
    } catch (e) {
      // do nothing, not a config path
    }
  }

  if (options.protractorPath) {
    options.protractorPath = resolve(options.protractorPath)
  } else {
    // '.../node_modules/protractor/lib/protractor.js'
    let protractorMainPath = require.resolve('protractor')
    // '.../node_modules/protractor/bin/protractor'
    options.protractorPath = resolve(protractorMainPath, '../../bin/protractor')
  }

  return options
}

export default parseOptions

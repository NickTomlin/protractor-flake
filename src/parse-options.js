import {resolve} from 'path'

const DEFAULT_OPTIONS = {
  nodeBin: 'node',
  maxAttempts: 3,
  protractorArgs: [],
  // set logColor to one of the colors available in 'chalk' - https://github.com/chalk/chalk
  logColor: null,
  // the name of one of the included parsers
  // a function to be used as a parser
  // or the path to a node module that exports a parser
  parser: 'standard'
}

function parseOptions (providedOptions) {
  let options = Object.assign({}, DEFAULT_OPTIONS, providedOptions)

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

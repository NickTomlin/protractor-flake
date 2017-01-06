import {resolve} from 'path'
import styles from 'chalk'

const DEFAULT_OPTIONS = {
  nodeBin: 'node',
  maxAttempts: 3,
  protractorArgs: [],
  // set color to one of the colors available at 'chalk' - https://github.com/chalk/ansi-styles#colors
  // set false to disable coloring
  color: 'magenta',
  // the name of one of the included parsers
  // a function to be used as a parser
  // or the path to a node module that exports a parser
  parser: 'standard'
}

function parseOptions (providedOptions) {
  let options = Object.assign({}, DEFAULT_OPTIONS, providedOptions)

  // normalizing options.color to be a boolean or a color value
  options.color = (options.color === 'false' || options.color === false) ? false : options.color

  if (!(options.color === false || options.color in styles)) {
    throw new Error('Invalid color option. Set color to true or to one of the value from https://github.com/chalk/ansi-styles#colors')
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

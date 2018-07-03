type Options = {
  nodeBin?: string
  maxAttempts?: number
  // set color to one of the colors available at 'chalk' - https://github.com/chalk/ansi-styles#colors
  // set false to disable coloring
  color?: string | boolean
  protractorArgs?: string[]
  protractorPath?: string
  // the name of one of the included parsers
  // a function to be used as a parser
  // or the path to a node module that exports a parser
  parser?: string
  // specify a different protractor config to apply after the first execution attempt
  // either specify a config file, or cli args (ex. --capabilities.browser=chrome)
  protractorRetryConfig?: string
  protractorSpawnOptions?: object
}

export default Options

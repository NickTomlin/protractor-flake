export default {
  name: 'standard',

  parse (output) {
    let failedSpecs = new Set()
    let match = null
    let FAILED_LINES = /at (?:\[object Object\]|Object|Context)\.(?:<anonymous>|it|beforeEach|afterEach|before|after) \((([A-Za-z]:\\)?.*?):.*\)/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      // windows output includes stack traces from
      // webdriver so we filter those out here
      if (!/node_modules/.test(match[1])) {
        failedSpecs.add(match[1])
      }
    }

    return [...failedSpecs]
  }
}

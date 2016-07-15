const CUCUMBERJS_TEST = /^\d+ scenarios?/m

export default {
  name: 'CucumberParser',
  test (output) {
    return CUCUMBERJS_TEST.test(output)
  },

  parse (failedSpecs, output) {
    let match = null
    let FAILED_LINES = /(.*?):\d+ # Scenario:.*/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      failedSpecs.add(match[1])
    }

    return failedSpecs
  }
}

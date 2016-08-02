export default {
  name: 'cucumber',

  parse (output) {
    let match = null
    let failedSpecs = []
    let FAILED_LINES = /(.*?):\d+ # Scenario:.*/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      failedSpecs.push(match[1])
    }

    return failedSpecs
  }
}

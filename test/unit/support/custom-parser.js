module.exports = {
  name: 'custom parser',
  parse (output) {
    let failedSpecs = []
    let match = null
    let FAILED_LINES = /custom failure trace: (.*)/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      if (failedSpecs.indexOf(match[1]) === -1) {
        failedSpecs.add(match[1])
      }
    }

    return failedSpecs
  }
}

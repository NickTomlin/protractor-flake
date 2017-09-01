export default {
  name: 'cucumber',
  parse (output) {
    let match = null
    let failedSpecs = []
    let testsOutput = output.split('------------------------------------')
    let RESULT_FAIL = 'Failures:'
    let SPECFILE_REG = /Specs:\s(.*\.feature)/g
    testsOutput.forEach(function (test) {
      // only check specs when RESULT_FAIL, ` Specs: ` is always printed when at least multiple features on 1 instance
      // are run with `shardTestFiles: true`
      if (test.indexOf(RESULT_FAIL) > -1) { // eslint-disable-line no-cond-assign
        while (match = SPECFILE_REG.exec(test)) { // eslint-disable-line no-cond-assign
          failedSpecs.push(match[1])
        }
      }
    })
    // Remove double values
    return [...new Set(failedSpecs)]
  }
}

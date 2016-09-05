export default {
  name: 'cucumberMulti',
  parse (output) {
    let match = null
    let failedSpecs = []
    let testsOutput = output.split('------------------------------------')
    let RESULT_FAIL = /Failures:.*/g
    let SPECFILE_REG = /Specs:\s(.*\.feature)/g
    testsOutput.forEach(function (test) {
      let specfile
      let result = 'passed'
      // only check specs when RESULT_FAIL, ` Specs: ` is always printed when at least multiple features on 1 instance
      // are run with `shardTestFiles: true`
      if (RESULT_FAIL.exec(test)) { // eslint-disable-line no-cond-assign
        console.log('Failed')
        while (match = SPECFILE_REG.exec(test)) { // eslint-disable-line no-cond-assign
          specfile = match[1]
          result = 'failed'
        }
      }
      if (specfile && result === 'failed') {
        if (!/node_modules/.test(specfile)) {
          failedSpecs.push(specfile)
        }
      }
    })
    // Remove double values
    return [...new Set(failedSpecs)]
  }
}

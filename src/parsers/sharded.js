const PROTRACTOR_SHARDED = /------------------------------------/g
const SPECFILE_REG = /.+Specs:\s(.*\.js)/g

export default {
  name: 'ShardedParser',
  test (output) {
    return PROTRACTOR_SHARDED.test(output) && SPECFILE_REG.test(output)
  },

  parse (failedSpecs, output) {
    let match = null
    let testsOutput = output.split('------------------------------------')
    testsOutput.shift()
    let RESULT_REG = /\d+\sspec|assertions?,\s(\d+)\sfailures?/g
    testsOutput.forEach(function (test) {
      let specfile
      let result = 'failed'
      // retrieve specfile from run;
      while (match = SPECFILE_REG.exec(test)) { // eslint-disable-line no-cond-assign
        specfile = match[1]
      }
      // check for string 'X specs, X failures' and verify that failures === 0;
      while (match = RESULT_REG.exec(test)) { // eslint-disable-line no-cond-assign
        if (match[1] === '0') {
          result = 'passed'
        }
      }
      if (result === 'failed') {
        if (!/node_modules/.test(specfile)) {
          failedSpecs.add(specfile)
        }
      }
    })

    return failedSpecs
  }
}

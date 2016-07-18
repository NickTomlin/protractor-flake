export default function (output = '') {
  let match = null
  let CUCUMBERJS_TEST = /^\d+ scenarios?/m
  let failedSpecs = new Set()
  let PROTRACTOR_SHARDED = /------------------------------------/g
  let SPECFILE_REG = /.*Specs:\s(.*\.js)/g

  if (PROTRACTOR_SHARDED.test(output) && SPECFILE_REG.test(output)) {
    let testsOutput = output.split('------------------------------------').slice(1)

    let RESULT_REG = /,\s(\d+)\sfailures?/g
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
  } else if (CUCUMBERJS_TEST.test(output)) {
    let FAILED_LINES = /(.*?):\d+ # Scenario:.*/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      failedSpecs.add(match[1])
    }
  } else {
    let FAILED_LINES = /at (?:\[object Object\]|Object)\.<anonymous> \((([A-Za-z]:\\)?.*?):.*\)/g
    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      // windows output includes stack traces from
      // webdriver so we filter those out here
      if (!/node_modules/.test(match[1])) {
        failedSpecs.add(match[1])
      }
    }
  }

  return [...failedSpecs]
}

export default function (output = '') {
  let match = null
  let CUCUMBERJS_TEST = /^\d+ scenarios?/m
  let failedSpecs = new Set()

  if (CUCUMBERJS_TEST.test(output)) {
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
  let FAILED_UNEXPECTED = /UnknownError:/g
  while (match = FAILED_UNEXPECTED.exec(output)) { // eslint-disable-line no-cond-assign
    // specfiles can not be discovered with UnknownErrors
    // so we reset the entire failedSpecs
    // to make sure these specs are not skipped
    if (!/node_modules/.test(match[1])) {
      console.log('Something terrible happened (UnknownError found), clearing failedSpecs')
      failedSpecs = new Set()
    }
  }

  return [...failedSpecs]
}

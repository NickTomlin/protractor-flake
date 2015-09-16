export default function (output = '') {
  let match = null;
  let CUCUMBERJS_TEST = /^\d+ scenarios?/m
  let failedSpecs = new Set();

  if (CUCUMBERJS_TEST.test(output)) {
    let FAILED_LINES = /(.*?):\d+ # Scenario:.*/g;
    while (match = FAILED_LINES.exec(output)) {
      failedSpecs.add(match[1]);
    }
  } else {
    let FAILED_LINES = /at (?:\[object Object\]|Object)\.<anonymous> \((([A-Z]:\\)?.*?):.*\)/g;
    while (match = FAILED_LINES.exec(output)) {
      // windows output includes stack traces from
      // webdriver so we filter those out here
      if (!/node_modules/.test(match[1])) {
        failedSpecs.add(match[1]);
      }
    }
  }

  return [...failedSpecs];
}

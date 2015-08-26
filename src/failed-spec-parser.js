export default function (output = '') {
  let match = null;
  let FAILED_LINES = /at \[object Object\]\.<anonymous> \((([A-Z]:\\)?.*?):.*\)/g;
  let failedSpecs = new Set();

  while (match = FAILED_LINES.exec(output)) {
    // windows output includes stack traces from
    // webdriver so we filter those out here
    if (!/node_modules/.test(match[1])) {
      failedSpecs.add(match[1]);
    }
  }

  return [...failedSpecs];
}

export default function (output = '') {
  let match = null;
  let FAILED_LINES = /at \[object Object\]\.<anonymous> \((.*?):.*\)/g;
  let failedSpecs = new Set();

  while (match = FAILED_LINES.exec(output)) {
    failedSpecs.add(match[1]);
  }

  return [...failedSpecs];
}

const FAILED_LINES = /at \[object Object\]\.<anonymous> \((.*?):.*\)/g;

export default function (output = '') {
  var output = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var failedSpecLines = [];
  var match;
  //iterate over all matches and prevent adding a spec twice (e.g. when using multiCapabilities)
  while (match = FAILED_LINES.exec(output)) {
    if (failedSpecLines.indexOf(match[1]) == -1) {
      failedSpecLines.push(match[1]);
    }
  }
  return failedSpecLines;
};

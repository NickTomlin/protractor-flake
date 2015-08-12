const FAILED_LINE = /at \[object Object\]\.<anonymous> \((.*)\)/g;

export default function (output) {
  // this could all probably fit into one regex...
  var failedSpecLines = output.match(FAILED_LINE);

  return failedSpecLines.map(function (line) {
    let path = line.match(/\((.*):/)[1];
    return path.slice(0, [path.length - 2]);
  });
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FAILED_LINE = /at \[object Object\]\.<anonymous> \((.*)\)/g;

exports["default"] = function (output) {
  // this could all probably fit into one regex...
  var failedSpecLines = output.match(FAILED_LINE);

  return failedSpecLines.map(function (line) {
    var path = line.match(/\((.*):/)[1];
    return path.slice(0, [path.length - 2]);
  });
};

module.exports = exports["default"];
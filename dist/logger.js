"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var LOG_LEVELS = {
  debug: 1,
  info: 2,
  silent: 3
};

exports["default"] = function (levelName, message) {
  var currentLevel = LOG_LEVELS[process.env.PROTRACTOR_FLAKE_LOG_LEVEL] || LOG_LEVELS.info;
  var incomingLevel = LOG_LEVELS[levelName];

  if (incomingLevel >= currentLevel) {
    process.stdout.write(message);
  }
};

module.exports = exports["default"];
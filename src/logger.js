const LOG_LEVELS = {
  debug: 1,
  info: 2,
  silent: 3
};

export default function (levelName, message) {
  let currentLevel = LOG_LEVELS[process.env.PROTRACTOR_FLAKE_LOG_LEVEL] || LOG_LEVELS.info;
  let incomingLevel = LOG_LEVELS[levelName]

  if (incomingLevel >= currentLevel) {
    process.stdout.write(message);
  }
}

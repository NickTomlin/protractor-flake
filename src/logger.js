import chalk from 'chalk'

const LOG_LEVELS = {
  debug: 1,
  info: 2,
  silent: 3
}

class Logger {
  constructor (color) {
    this.color = null
    if (chalk.supportsColor) {
      this.color = color
    }
  }

  log (levelName, message) {
    let currentLevel = LOG_LEVELS[process.env.PROTRACTOR_FLAKE_LOG_LEVEL] || LOG_LEVELS.info
    let incomingLevel = LOG_LEVELS[levelName]

    if (incomingLevel >= currentLevel) {
      message = this.colorize(message)
      process.stdout.write(message)
    }
  }

  colorize (message) {
    if (this.color in chalk.styles) {
      return chalk[this.color](message)
    } else {
      return message
    }
  }
}

export default Logger

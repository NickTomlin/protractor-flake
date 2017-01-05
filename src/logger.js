import chalk from 'chalk'

const LOG_LEVELS = {
  debug: 1,
  protractor: 2,
  info: 3,
  silent: 4
}

const DEFAULT_COLOR = 'magenta'

class Logger {
  constructor (color) {
    this.color = null
    if (chalk.supportsColor) {
      if (color == "true") {
        this.color = DEFAULT_COLOR
      }
      else {
        this.color = color
      }
    }
  }

  log (levelName, message, useColor = true) {
    let currentLevel = LOG_LEVELS[process.env.PROTRACTOR_FLAKE_LOG_LEVEL] || LOG_LEVELS.protractor
    let incomingLevel = LOG_LEVELS[levelName]

    if (incomingLevel >= currentLevel) {
      message = this.colorize(message, useColor)
      process.stdout.write(message)
    }
  }

  protractor (message) {
    this.log('protractor', message, false)
  }

  colorize (message, useColor) {
    if (chalk.supportsColor && this.color && useColor) {
      return chalk[this.color](message)
    } else {
      return message
    }
  }
}

export default Logger

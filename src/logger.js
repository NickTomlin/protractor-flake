import {styles, supportsColor} from 'chalk'

const LOG_LEVELS = {
  debug: 1,
  info: 2,
  silent: 3
}

class Logger {
  constructor (color) {
    this.color = null
    if (supportsColor) {
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
    if (this.color in styles) {
      return styles[this.color].open + message + styles[this.color].close
    } else {
      return message
    }
  }
}

export default Logger

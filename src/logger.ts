import chalk from 'chalk'

interface LogLevels {
  [key: string]: number
}

const LOG_LEVELS: LogLevels = {
  debug: 0,
  protractor: 1,
  info: 2,
  silent: 3
}

class Logger {
  color: string | boolean

  constructor (color: string | boolean) {
    this.color = color
  }

  log (levelName: string, message: string, useColor = true) {
    let logLevel: string = process.env.PROTRACTOR_FLAKE_LOG_LEVEL
    let currentLevel = LOG_LEVELS[logLevel] || LOG_LEVELS.protractor
    let incomingLevel = LOG_LEVELS[levelName]

    if (incomingLevel >= currentLevel) {
      message = this.colorize(message, useColor)
      process.stdout.write(message)
    }
  }

  protractor (message: any) {
    this.log('protractor', message, false)
  }

  colorize (message: any, useColor: boolean) {
    if (useColor && chalk.supportsColor && this.color) {
      return chalk.keyword(this.color as string)(message)
    } else {
      return message
    }
  }
}

export default Logger

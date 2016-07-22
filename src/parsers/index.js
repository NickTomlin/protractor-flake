import cucumberParser from './cucumber'
import multiTestParser from './multitest'
import standardParser from './standard'

let allParsers = [cucumberParser, multiTestParser, standardParser]

function findParser (name) {
  let parser = allParsers.find((parser) => name === parser.name)
  if (name && !parser) {
    throw new Error('Invalid Parser Specified')
  }

  return parser
}

export { allParsers, findParser }

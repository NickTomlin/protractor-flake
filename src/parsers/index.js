import CucumberParser from './cucumber'
import MultiTestParser from './multitest'
import StandardParser from './standard'

let allParsers = [CucumberParser, MultiTestParser, StandardParser]

function findParser (name) {
  let parser = allParsers.find((parser) => name === parser.name)
  if (name && !parser) {
    throw new Error('Invalid Parser Specified')
  }

  return parser
}

export { allParsers, findParser }

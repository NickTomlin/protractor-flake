import CucumberParser from './cucumber'
import ShardedParser from './sharded'
import StandardParser from './standard'

let allParsers = [CucumberParser, ShardedParser, StandardParser]

function findParser (name) {
  let parser = allParsers.find((parser) => name === parser.name)
  if (name && !parser) {
    throw new Error('Invalid Parser Specified')
  }

  return parser
}

export { allParsers, findParser }

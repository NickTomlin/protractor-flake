import cucumberParser from './cucumber'
import multiTestParser from './multitest'
import standardParser from './standard'

let all = [cucumberParser, multiTestParser, standardParser]

function find (name) {
  let parser = all.find((parser) => name === parser.name)
  if (name && !parser) {
    throw new Error('Invalid Parser Specified')
  }

  return parser
}

export default { all, find }

import cucumberParser from './cucumber'
import multiTestParser from './multitest'
import standardParser from './standard'

let all = [cucumberParser, multiTestParser, standardParser]

function getParser (name, output = '') {
  let parser
  if (name) {
    parser = all.find((parser) => name === parser.name)
    if (!parser) { throw new Error(`Invalid Parser Specified: ${name}`) }
  } else {
    parser = all.find((p) => {
      return p.test(output)
    })
  }
  return parser
}

export default { all, getParser }

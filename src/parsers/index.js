import cucumber from './cucumber'
import cucumberMulti from './cucumber.multi'
import multi from './multi'
import standard from './standard'

let all = { cucumber, cucumberMulti, multi, standard }

function getParser (name) {
  if (name && all[name]) {
    return all[name]
  } else {
    throw new Error(`Invalid Parser Specified: ${name}`)
  }
}

export default { all, getParser }

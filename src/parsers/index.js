import cucumber from './cucumber'
import multi from './multi'
import standard from './standard'

let all = { cucumber, multi, standard }

function getParser (name) {
  if (name && all[name]) {
    return all[name]
  } else {
    throw new Error(`Invalid Parser Specified: ${name}`)
  }
}

export default { all, getParser }

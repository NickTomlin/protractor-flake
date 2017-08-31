import cucumber from './cucumber'
import { extname } from 'path'
import multi from './multi'
import standard from './standard'

let all = { cucumber, multi, standard }

function handleObject (parserObject) {
  if (typeof parserObject.parse !== 'function') {
    throw new Error(`Invalid Parser Object specified. Your parser must define a \`parse\` method`)
  }

  return parserObject
}

function handlePath (parserPath) {
  try {
    let customParserPath = require.resolve(parserPath)
    return require(customParserPath)
  } catch (e) {
    throw new Error(`Invalid Custom Parser Path Specified: ${parserPath}`)
  }
}

function handleFlakeParser (parserName) {
  if (all[parserName]) {
    return all[parserName]
  } else {
    throw new Error(`Invalid Parser Specified: ${parserName}`)
  }
}

function getParser (parser = '') {
  if (parser.hasOwnProperty('parse')) {
    return handleObject(parser)
  }

  if (extname(parser)) {
    return handlePath(parser)
  }

  return handleFlakeParser(parser)
}

export default { all, getParser }

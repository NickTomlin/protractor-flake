import cucumber from './cucumber'
import { resolve, extname } from 'path'
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
  // 'my-custom-parser' or './my-custom-parser'
  try {
    return require(parserPath)
  } catch (e) {}

  // /path/to/parser or ../path/to/parser
  try {
    return require(resolve(parserPath))
  } catch (e) {}

  throw new Error(`Invalid Custom Parser Path Specified: ${parserPath}`)
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

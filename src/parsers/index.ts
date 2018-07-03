import cucumber from './cucumber'
import Parser from './parser'
import { resolve, extname } from 'path'
import multi from './multi'
import standard from './standard'

type ParserList = {
  [key: string]: Parser
}

const all: ParserList = { cucumber, multi, standard }

function handleObject (parserObject: any) {
  if (typeof parserObject.parse !== 'function') {
    throw new Error(`Invalid Parser Object specified. Your parser must define a \`parse\` method`)
  }

  return parserObject
}

function handlePath (parserPath: string) {
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

function handleFlakeParser (parserName: string) {
  if (all[parserName]) {
    return all[parserName]
  } else {
    throw new Error(`Invalid Parser Specified: ${parserName}`)
  }
}

function getParser (parser: (Parser | string) = '') {
  if (parser.hasOwnProperty('parse')) {
    return handleObject(parser)
  }

  if (extname(parser as string)) {
    return handlePath(parser as string)
  }

  return handleFlakeParser(parser as string)
}

export { all, getParser }

import {allParsers, findParser} from './parsers'

export default function (output = '', parserName = '') {
  let parser

  if (parserName) {
    parser = findParser(parserName)
  } else {
    parser = allParsers.find((p) => {
      return p.test(output)
    })
  }

  let failedSpecs = parser.parse(new Set(), output)

  return [...failedSpecs]
}

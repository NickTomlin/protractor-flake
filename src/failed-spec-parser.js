import parsers from './parsers'

export default function (output = '', parserName = '') {
  let parser

  if (parserName) {
    parser = parsers.find(parserName)
  } else {
    parser = parsers.all.find((p) => {
      return p.test(output)
    })
  }

  let failedSpecs = parser.parse(new Set(), output)

  return [...failedSpecs]
}

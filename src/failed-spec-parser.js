import parsers from './parsers/all'

export default function (output = '') {
  let parser =  parsers.find((p) => {
    return p.test(output)
  })
  let failedSpecs = parser.parse(new Set(), output)

  return [...failedSpecs]
}

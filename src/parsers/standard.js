// note: we use String.raw here to avoid the need to double escape '\' characters
// e.g. using a traditional string we would need '\\[object Object\\]'
// whereas raw allows us the terser `\[` because it doesn't interpret '\' as an escape
const context = String.raw`\[object Object\]|Object|Context|UserContext`
const source = String.raw`<anonymous>|it|beforeEach|afterEach|before|after`
const filepath = String.raw`(([A-Za-z]:\\)?.*?):.*`
const regexString = String.raw`at (?:${context})\.(?:${source}) \(${filepath}\)`

export default {
  name: 'standard',

  parse (output) {
    let failedSpecs = new Set()
    let match = null
    let FAILED_LINES = new RegExp(regexString, 'g')

    while (match = FAILED_LINES.exec(output)) { // eslint-disable-line no-cond-assign
      // windows output includes stack traces from
      // webdriver so we filter those out here
      if (!/node_modules/.test(match[1])) {
        failedSpecs.add(match[1])
      }
    }

    return [...failedSpecs]
  }
}

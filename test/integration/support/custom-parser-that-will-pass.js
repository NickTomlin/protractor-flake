module.exports = {
  name: 'MyCustomParser',
  parse (outputFromProtractorTests) {
    return ['test/integration/support/passing-test.js']
  }
}

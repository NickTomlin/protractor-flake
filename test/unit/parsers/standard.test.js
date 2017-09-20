import readFixture from '../support/read-fixture'
import standardParser from '../../../src/parsers/standard'

context('standardParser', function () {
  describe('#parse', () => {
    it('returns an empty array if output has no matches', () => {
      let output = `
      Wow
      Much Text   Wow
      So whitespace
      object Object
      Wow
      `

      expect(standardParser.parse(output)).to.eql([])
    })

    it('properly handles jasmine2 <anonymous> output', function () {
      let output = readFixture('failed-jasmine2-test-output.txt')

      expect(standardParser.parse(output)).to.eql([
        '/tests/another-flakey.test.js',
        '/tests/flakey.test.js'
      ])
    })

    it('properly handles jasmine2 `it` output', function () {
      let output = readFixture('failed-jasminewd2-it-test-output.txt')

      expect(standardParser.parse(output)).to.eql([
        '/opt/superdesk/client-core/spec/search_spec.js',
        '/opt/superdesk/client-core/spec/analytics_spec.js'
      ])
    })

    it('properly handles large line numbers', () => {
      let output = `
    at [object Object].<anonymous> (/tests/a-flakey.test.js:999:102)

    Finished in 0.538 seconds
    [31m1 test, 1 assertion, 1 failure
    [0m
      `

      expect(standardParser.parse(output)).to.eql([
        '/tests/a-flakey.test.js'
      ])
    })

    it('properly finds specs in mocha Context based stack traces', () => {
      const output = readFixture('failed-mocha-test-output.txt')
      expect(standardParser.parse(output)).to.eql([
        'test-v2-e2e/filling.e2e.js'
      ])
    })

    it('properly finds specs in mocha beforeEach', () => {
      const output = readFixture('failed-mocha-before-each-test-output.txt')
      expect(standardParser.parse(output)).to.eql([
        'test-v2-e2e/filling.e2e.js'
      ])
    })

    it('properly finds specs in mocha afterEach', () => {
      const output = readFixture('failed-mocha-after-each-test-output.txt')
      expect(standardParser.parse(output)).to.eql([
        'test-v2-e2e/util/reset.js'
      ])
    })

    it('handles output on windows', function () {
      let output = readFixture('failed-windows-test-output.txt')

      expect(standardParser.parse(output)).to.eql([
        'd:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\a-flakey.test.js',
        'C:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\another-flakey.test.js'
      ])
    })

    it('does not duplicate specs with multicapabilities output', () => {
      let output = readFixture('multicapabilities-failed-test-output.txt')

      expect(standardParser.parse(output)).to.eql([
        '/tests/a-flakey.test.js',
        '/tests/another-flakey.test.js'
      ])
    })
  })
})

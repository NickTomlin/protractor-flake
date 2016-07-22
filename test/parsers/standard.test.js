import readFixture from '../support/read-fixture'
import standardParser from '../../src/parsers/standard'

context('standardParser', function () {
  describe('#test', () => {
    it('properly identifies failed spec files', () => {
      let output = readFixture('failed-test-output.txt')

      expect(standardParser.test(output)).to.eql(true)
    })
  })

  describe('#parse', () => {
    it('returns an empty array if output has no matches', () => {
      let output = `
      Wow
      Much Text   Wow
      So whitespace
      object Object
      Wow
      `

      expect(standardParser.parse(new Set(), output)).to.eql([])
    })

    it('properly handles jasmine2 output', function () {
      let output = readFixture('failed-jasmine2-test-output.txt')

      expect(standardParser.parse(new Set(), output)).to.eql([
        '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js',
        '/Users/ntomlin/workspace/protractor-flake/test/support/flakey.test.js'
      ])
    })

    it('properly handles large line numbers', () => {
      let output = `
    at [object Object].<anonymous> (/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js:999:102)

    Finished in 0.538 seconds
    [31m1 test, 1 assertion, 1 failure
    [0m
      `

      expect(standardParser.parse(new Set(), output)).to.eql([
        '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js'
      ])
    })

    it('handles output on windows', function () {
      let output = readFixture('failed-windows-test-output.txt')

      expect(standardParser.parse(new Set(), output)).to.eql([
        'd:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\a-flakey.test.js',
        'C:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\another-flakey.test.js'
      ])
    })

    it('does not duplicate specs with multicapabilities output', () => {
      let output = readFixture('multicapabilities-failed-test-output.txt')

      expect(standardParser.parse(new Set(), output)).to.eql([
        '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js',
        '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js'
      ])
    })
  })
})

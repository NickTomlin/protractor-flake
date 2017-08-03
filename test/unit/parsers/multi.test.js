import readFixture from '../support/read-fixture'
import multiParser from '../../../src/parsers/multi'

context('multiParser', function () {
  describe('#parse', () => {
    it('properly handles error output in sharded tests', function () {
      let output = readFixture('sharded-error-test-output.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/a-flakey.test.js',
        '/tests/another-flakey.test.js'
      ])
    })

    it('properly handles a single test that failed in multiple browsers', function () {
      let output = readFixture('multicapabilities-multifailures-withspecs.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/a-flakey.test.js'
      ])
    })

    it('properly handles sharded output with a single failure', function () {
      let output = readFixture('sharded-output-single-failure.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/failed-spec.js'
      ])
    })

    it('properly handles sharded output without file path in exception output', function () {
      let output = readFixture('sharded-output-no-test-path.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/failed-spec.js'
      ])
    })

    it('properly handles error output in multicapabilities tests', function () {
      let output = readFixture('multicapabilities-withspecs.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/a-flakey.test.js'
      ])
    })

    it('properly handles error output in multicapabilities tests with coffee specs', function () {
      let output = readFixture('multicapabilities-with-coffee-specs.txt')

      expect(multiParser.parse(output)).to.eql([
        '/tests/a-flakey.test.coffee'
      ])
    })
  })
})

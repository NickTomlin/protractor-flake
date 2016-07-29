import readFixture from '../support/read-fixture'
import multiTestParser from '../../../src/parsers/multitest'

context('multiTestParser', function () {
  describe('#test', () => {
    it('properly identifies failed spec files for sharded output', () => {
      let output = readFixture('sharded-failed-test-output.txt')

      expect(multiTestParser.test(output)).to.eql(true)
    })
  })

  describe('#parse', () => {
    it('properly handles error output in sharded tests', function () {
      let output = readFixture('sharded-error-test-output.txt')

      expect(multiTestParser.parse(new Set(), output)).to.eql([
        '/tests/a-flakey.test.js',
        '/tests/another-flakey.test.js'
      ])
    })

    it('properly handles sharded output with a single failure', function () {
      let output = readFixture('sharded-output-single-failure.txt')

      expect(multiTestParser.parse(new Set(), output)).to.eql([
        '/tests/failed-spec.js'
      ])
    })

    it('properly handles sharded output without file path in exception output', function () {
      let output = readFixture('sharded-output-no-test-path.txt')

      expect(multiTestParser.parse(new Set(), output)).to.eql([
        '/tests/failed-spec.js'
      ])
    })

    it('properly handles error output in multicapabilities tests', function () {
      let output = readFixture('multicapabilities-withspecs.txt')

      expect(multiTestParser.parse(new Set(), output)).to.eql([
        '/tests/a-flakey.test.js'
      ])
    })
  })
})

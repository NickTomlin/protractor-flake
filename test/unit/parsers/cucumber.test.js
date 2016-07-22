import readFixture from '../support/read-fixture'
import cucumberParser from '../../../src/parsers/cucumber'

describe('cucumberParser', () => {
  const failedOutput = readFixture('failed-cucumberjs-output.txt')

  describe('#test', () => {
    it('properly identifies cucumber output', () => {
      expect(cucumberParser.test(failedOutput)).to.eq(true)
    })
  })

  describe('#parse', () => {
    it('properly identifies failed cucumberjs feature files', () => {
      expect(cucumberParser.parse(new Set(), failedOutput)).to.eql([
        '/Users/jrust/code/features/automated/fail.feature'
      ])
    })

    it('returns an empty array if cucumberjs output has no matches', () => {
      let successOutput = readFixture('success-cucumberjs-output.txt')

      expect(cucumberParser.parse(new Set(), successOutput)).to.eql([])
    })
  })
})

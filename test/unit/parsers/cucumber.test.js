import readFixture from '../support/read-fixture'
import cucumberParser from '../../../src/parsers/cucumber'

describe('cucumberParser', () => {
  const failedOutput = readFixture('failed-cucumberjs-output.txt')

  describe('#parse', () => {
    it('properly identifies failed cucumberjs feature files', () => {
      expect(cucumberParser.parse(failedOutput)).to.eql([
        '/Users/jrust/code/features/automated/fail.feature'
      ])
    })

    it('returns an empty array if cucumberjs output has no matches', () => {
      let successOutput = readFixture('success-cucumberjs-output.txt')

      expect(cucumberParser.parse(successOutput)).to.eql([])
    })
  })
})

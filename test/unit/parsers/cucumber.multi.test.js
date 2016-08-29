import readFixture from '../support/read-fixture'
import multiParser from '../../../src/parsers/cucumber.multi'

describe('cucumberMultiParser', () => {
  /**
   * How it works:
   * Single:
   * - 1 webdriver instance + 1 feature + error + shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 1 webdriver instance + 1 feature + error + !shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 1 webdriver instance + 1 feature + success + shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 1 webdriver instance + 1 feature + success + !shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 1 webdriver instance + 2 features + error + shardTestFiles
   *    SPECS ###################################################
   * - 1 webdriver instance + 2 features + error + !shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 1 webdriver instance + 2 features + success + shardTestFiles
   *    SPECS ###################################################
   * - 1 webdriver instance + 2 features + success + !shardTestFiles
   *    No Specs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   *
   * Conclusion:
   *
   *
   * Multi:
   * - 2 webdriver instances + 1 feature + error + !shardTestFiles
   *    SPECS for both ############################################
   * - 2 webdriver instances + 1 feature + error + shardTestFiles
   *    SPECS for both ############################################
   * - 2 webdriver instances + 1 feature + success + !shardTestFiles
   *    SPECS for both ############################################
   * - 2 webdriver instances + 1 feature + success + shardTestFiles
   *    SPECS for both ############################################
   * - 2 webdriver instances + 2 features + error + !shardTestFiles
   *    NO specs for both !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 2 webdriver instances + 2 features + error + shardTestFiles
   *    SPECS for both ############################################
   * - 2 webdriver instances + 2 features + success + !shardTestFiles
   *    NO specs for both !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * - 2 webdriver instances + 2 features + success + shardTestFiles
   *    SPECS for both ############################################
   *
   * Conclusion:
   * SHARED needs to be true for multiple. Then it's always printed. First check on `Failures:`, then on `Specs:`   *
   */
  describe('#parse', () => {
    it('properly handles error output in multicapabilities tests with a feature', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-feature-failure.txt')

      expect(multiParser.parse(output)).to.eql([
        '/Users/wswebcreation/test/e2e/features/functional/flakey.feature'
      ])
    })

    it('properly handles error output in sharded multicapabilities tests with a feature', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-shared-feature-failure.txt')

      expect(multiParser.parse(output)).to.eql([
        '/Users/wswebcreation/test/e2e/features/functional/flakey.feature'
      ])
    })

    it('returns an empty array if cucumberjs output has no matches for a multicapabilities tests with a feature', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-feature-success.txt')

      expect(multiParser.parse(output)).to.eql([])
    })

    it('returns an empty array if cucumberjs output has no matches for a sharded multicapabilities tests with a feature', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-shared-feature-success.txt')

      expect(multiParser.parse(output)).to.eql([])
    })

    it('can\'t handles error output in multicapabilities tests with features', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-features-failures.txt')

      expect(multiParser.parse(output)).to.eql([])
    })

    it('properly handles error output in sharded multicapabilities tests with features and double failures', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-shared-features-failures.txt')

      expect(multiParser.parse(output)).to.eql([
        '/Users/wswebcreation/test/e2e/features/functional/another.flakey.feature',
        '/Users/wswebcreation/test/e2e/features/functional/flakey.feature'
      ])
    })

    it('returns an empty array if cucumberjs output has no matches for a multicapabilities tests with features', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-features-success.txt')

      expect(multiParser.parse(output)).to.eql([])
    })

    it('returns an empty array if cucumberjs output has no matches for a sharded multicapabilities tests with features', function () {
      let output = readFixture('cucumberjs/cucumberjs-multi-output-shared-features-success.txt')

      expect(multiParser.parse(output)).to.eql([])
    })
  })
})

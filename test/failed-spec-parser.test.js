import readFixture from './support/read-fixture';
import failedSpecParser from '../src/failed-spec-parser';

describe('failed spec parser', () => {
    it('properly identifies failed spec files', () => {
      let output = readFixture('failed-test-output.txt');

      expect(failedSpecParser(output)).to.eql([
        '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js'
      ]);
    });

    it('properly identifies failed spec files for sharded output', () => {
      let output = readFixture('sharded-failed-test-output.txt');

      expect(failedSpecParser(output)).to.eql([
        '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js',
        '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js'
      ]);
    });
});

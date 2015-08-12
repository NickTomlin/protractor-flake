import {readFileSync} from 'fs';
import {resolve} from 'path';
import failedSpecParser from '../src/failed-spec-parser';

function readFixture (fixtureFile) {
  return readFileSync(resolve(__dirname, `./support/fixtures/${fixtureFile}`), 'utf8');
}

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

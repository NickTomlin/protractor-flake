import runner from './support/runner';
import {unlink} from 'fs';
import {resolve} from 'path';
import {writeFileSync} from 'fs';

const FLAKE_FILE = resolve(__dirname + '/support/times-flaked');
const CONFIG_PATH = 'test/support/protractor-config';
const SINGLE_INSTANCE_PATH = `${CONFIG_PATH}/protractor-sharded.conf.js`;


beforeEach((done) => {
  unlink(FLAKE_FILE, function (err) {
    if (err && err.code !== 'ENOENT') {
      return done(err);
    }

    done();
  });
});

describe('Protractor Flake Executable', function () {
  this.timeout(30000);
  this.slow(25000);

  it('Exits successfully if test passes before max limit is reached',  (done) => {
    runner(['--max-attempts=3', '--', SINGLE_INSTANCE_PATH], (err, status) => {
      expect(err).to.equal(null);
      expect(status).to.equal(0);
      done();
    });
  });

  it('exits unsuccessfully if test fails outside of max limit', (done) => {
    runner(['--max-attempts=1', '--', SINGLE_INSTANCE_PATH], (err, status, output) => {
      expect(status).to.equal(1);
      done();
    });
  });
});

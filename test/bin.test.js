import runner from './support/runner';
import assert from 'assert';
import {unlink} from 'fs';
import {resolve} from 'path';

var FLAKE_FILE = resolve(__dirname + '/../times-flaked');

beforeEach((done) => {
  unlink(FLAKE_FILE, function (err) {
    if (err && err.code !== 'ENOENT') {
      return done(err);
    }

    done();
  });
});

describe('Protractor Flake Executable', () => {
  it('Exits successfully if test passes before max limit is reached',  (done) => {
    runner(['--max-attempts=3'], (err, status) => {
      assert.equal(status, 0);
      done();
    });
  });

  it('exits unsuccessfully if test fails outside of max limit', (done) => {
    runner(['--max-attempts=1'], (err, status) => {
      assert.equal(status, 1);
      done();
    });
  });
});

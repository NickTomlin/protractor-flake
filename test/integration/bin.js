import server from '../support/server';
import {unlink} from 'fs';
import {resolve} from 'path';
import {writeFileSync} from 'fs';
import {spawn} from 'child_process';

const FLAKE_FILE = resolve(__dirname + '/../support/times-flaked');
const CONFIG_PATH = 'test/support/protractor-config';
const SINGLE_INSTANCE_PATH = `${CONFIG_PATH}/protractor-sharded.conf.js`;

describe('Protractor Flake Executable', function () {
  before((done) => {
    server.listen({port: process.env.PORT}, () => {
      done();
    });
  });

  after(() => {
    server.close();
  });

  beforeEach((done) => {
    unlink(FLAKE_FILE, function (err) {
      if (err && err.code !== 'ENOENT') {
        return done(err);
      }

      done();
    });
  });

  it('Exits successfully if test passes before max limit is reached',  (done) => {
    let process = spawn('./bin/protractor-flake', ['--max-attempts', '2', '--', SINGLE_INSTANCE_PATH], {stdio: 'inherit'});

    process.on('close', (status) => {
      expect(status).to.equal(0);
      done();
    });
  });

  it('exits unsuccessfully if test fails outside of max limit', (done) => {
    let process = spawn('./bin/protractor-flake', ['--max-attempts', '1', '--', SINGLE_INSTANCE_PATH], {stdio: 'inherit'});

    process.on('close', (status) => {
      expect(status).to.equal(1);
      done();
    });
  });
});

import proxyquire from 'proxyquire';
import {spawn} from 'child_process';
import readFixture from './support/read-fixture';

const failedSingleTestOutput = readFixture('failed-test-output.txt');
const failedShardedTestOutput = readFixture('sharded-failed-test-output.txt');

describe('Protractor Flake', () => {
  let spawnStub = null;
  let protractorFlake = null;

  beforeEach(() => {
    spawnStub = sinon.stub().returns({
      on (event, callback) {
        spawnStub.endCallback = callback;
      },
      stdout: {
        on (event, callback) {
          spawnStub.dataCallback = callback;
        },
      }
    });

    protractorFlake = proxyquire('../src/index', {
      child_process: {
        spawn: spawnStub
      }
    });
  });

  it('runs protractor', () => {
    protractorFlake({protractorPath: 'protractor'});

    expect(spawnStub).to.have.been.calledWithMatch('protractor');
  });


  context('failed specs', () => {
    it('calls callback with an err if a negative status is returned', (done) => {
      protractorFlake({protractorPath: 'protractor', maxAttempts: 1}, (status) => {
        expect(status).to.equal(status, 1);
        done();
      });

      spawnStub.endCallback(1);
    });

    it('calls callback with an err if a negative status is after multiple attempts', function (done) {
      protractorFlake({protractorPath: 'protractor', maxAttempts: 3}, (status) => {
        expect(status).to.equal(status, 1);
        done();
      });

      spawnStub.endCallback(1);
      spawnStub.endCallback(1);
      spawnStub.endCallback(1);
    });

    it('calls callback with output from protractor process', () => {
      let fakeOutput = 'Test';
      protractorFlake({protractorPath: 'protractor', maxAttempts: 3}, (status, output) => {
        expect(status).to.equal(status, 1);
        expect(output).to.equal('Test');
        done();
      });

      spawnStub.endCallback(1, fakeOutput);
    });

    it('does not blow up if no callback is passed', function () {
      protractorFlake({protractorPath: 'protractor', maxAttempts: 1});

      expect(() => {
        spawnStub.endCallback(1);
      }).to.not.throw();
    });

    it('isolates individual failed specs from protractor output', () => {
      protractorFlake({protractorPath: 'protractor', maxAttempts: 3});

      spawnStub.dataCallback(failedSingleTestOutput);
      spawnStub.endCallback(1);

      expect(spawnStub).to.have.been.calledWith('protractor', ['--specs', '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js']);
    });

    it('isolates failed specs for sharded protractor output', () => {
      protractorFlake({protractorPath: 'protractor', maxAttempts: 3});

      spawnStub.dataCallback(failedShardedTestOutput);
      spawnStub.endCallback(1);

      expect(spawnStub).to.have.been.calledWith('protractor', ['--specs', '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js,/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js']);
    });

    context('with --suite in protractorArgs', function () {
      it('removes --suite argument from protractorArgs if it is passed', () => {
        protractorFlake({
          protractorPath: 'protractor',
          maxAttempts: 3,
          '--': ['--suite=fail']
        });

        spawnStub.dataCallback(failedShardedTestOutput);
        spawnStub.endCallback(1);

        expect(spawnStub).to.have.been.calledWith('protractor', ['--specs', '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js,/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js']);
      });

      it('does not remove --suite for first test run', () => {
        protractorFlake({
          protractorPath: 'protractor',
          maxAttempts: 3,
          '--': ['--suite=fail']
        });

        expect(spawnStub).to.have.been.calledWith('protractor', [
          '--suite=fail'
        ]);
      });
    });

  });

  context('options', () => {
    it('defaults protractorPath to protractor on path', () => {
      protractorFlake();

      expect(spawnStub).to.have.been.calledWithMatch('protractor');
    });

    it('passes protractorArgs to spawned protractor process', () => {
      protractorFlake({protractorPath: 'protractor', protractorArgs: ['--suite=fail']})

      expect(spawnStub).to.have.been.calledWithMatch('protractor', ['--suite=fail']);
    });

    it('uses protractorSpawnOptions for spawned protractor process', () => {
      protractorFlake({protractorPath: 'protractor', protractorSpawnOptions: { cwd: './' }});

      expect(spawnStub).to.have.been.calledWithMatch('protractor', [], { cwd: './' });
    });
  });
});

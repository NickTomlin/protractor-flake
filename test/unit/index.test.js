import proxyquire from 'proxyquire'
import { resolve } from 'path'
import readFixture from './support/read-fixture'

const failedSingleTestOutput = readFixture('failed-test-output.txt')
const failedShardedTestOutput = readFixture('sharded-failed-test-output.txt')

describe('Protractor Flake', () => {
  let spawnStub = null
  let protractorFlake = null

  function pathToProtractor () {
    return resolve(require.resolve('protractor'), '../../bin/protractor')
  }

  beforeEach(() => {
    spawnStub = sandbox.stub().returns({
      on (event, callback) {
        spawnStub.endCallback = callback
      },
      stdout: {
        on (event, callback) {
          spawnStub.dataCallback = callback
        }
      },
      stderr: {
        on (event, callback) {
          spawnStub.dataCallback = callback
        }
      }
    })

    protractorFlake = proxyquire('../../src/index', {
      child_process: {
        spawn: spawnStub
      }
    })
  })

  it('uses node to run protractor', () => {
    protractorFlake()

    expect(spawnStub).to.have.been.calledWith('node', [pathToProtractor()])
  })

  context('failed specs', () => {
    it('calls callback with an err if a negative status is returned', (done) => {
      protractorFlake({maxAttempts: 1}, (status) => {
        expect(status).to.equal(status, 1)
        done()
      })

      spawnStub.endCallback(1)
    })

    it('calls callback with an err if a negative status is after multiple attempts', function (done) {
      protractorFlake({maxAttempts: 3}, (status) => {
        expect(status).to.equal(status, 1)
        done()
      })

      spawnStub.endCallback(1)
      spawnStub.endCallback(1)
      spawnStub.endCallback(1)
    })

    it('calls callback with output from protractor process', (done) => {
      protractorFlake({maxAttempts: 1}, (status, output) => {
        expect(status).to.equal(status, 1)
        expect(output).to.equal('Test')
        done()
      })

      spawnStub.dataCallback('Test')
      spawnStub.endCallback(1)
    })

    it('does not blow up if no callback is passed', function () {
      protractorFlake({maxAttempts: 1})

      expect(() => {
        spawnStub.endCallback(1)
      }).to.not.throw()
    })

    it('isolates individual failed specs from protractor output', () => {
      protractorFlake({maxAttempts: 3})

      spawnStub.dataCallback(failedSingleTestOutput)
      spawnStub.endCallback(1)

      expect(spawnStub).to.have.been.calledWith('node', [pathToProtractor(), '--specs', '/tests/a-flakey.test.js'])
    })

    it('isolates failed specs for sharded protractor output', () => {
      protractorFlake({maxAttempts: 3})

      spawnStub.dataCallback(failedShardedTestOutput)
      spawnStub.endCallback(1)

      expect(spawnStub).to.have.been.calledWith('node', [pathToProtractor(), '--specs', '/tests/a-flakey.test.js,/tests/another-flakey.test.js'])
    })

    context('with --suite in protractorArgs', function () {
      it('removes --suite argument from protractorArgs if it is passed', () => {
        protractorFlake({
          maxAttempts: 3,
          protractorArgs: [
            '--suite=fail',
            '--suite', 'fail',
            '--should-remain=yes'
          ]
        })

        spawnStub.dataCallback(failedShardedTestOutput)
        spawnStub.endCallback(1)

        expect(spawnStub).to.have.been.calledWith('node', [
          pathToProtractor(),
          '--should-remain=yes',
          '--specs', '/tests/a-flakey.test.js,/tests/another-flakey.test.js'
        ])
      })

      it('does not remove --suite for first test run', () => {
        protractorFlake({
          maxAttempts: 3,
          protractorArgs: ['--suite=fail']
        })

        expect(spawnStub).to.have.been.calledWith('node', [pathToProtractor(), '--suite=fail'])
      })
    })

    context('with --specs in protractorArgs', function () {
      it('removes --specs argument from protractorArgs if it is passed', () => {
        protractorFlake({
          maxAttempts: 3,
          protractorArgs: [
            '--specs=specs/fail',
            '--should-remain=yes',
            '--specs', 'specs/fail'
          ]
        })

        spawnStub.dataCallback(failedShardedTestOutput)
        spawnStub.endCallback(1)

        expect(spawnStub).to.have.been.calledWith('node', [
          pathToProtractor(),
          '--should-remain=yes',
          '--specs', '/tests/a-flakey.test.js,/tests/another-flakey.test.js'
        ])
      })

      it('does not remove --specs for first test run', () => {
        protractorFlake({
          maxAttempts: 3,
          protractorArgs: ['--specs=specs/fail', '--specs', 'specs/fail']
        })

        expect(spawnStub).to.have.been.calledWith('node', [pathToProtractor(), '--specs=specs/fail', '--specs', 'specs/fail'])
      })
    })
  })

  context('options', () => {
    it('allows a different path for protractor by using protractorPath option', () => {
      protractorFlake({protractorPath: '/arbitrary/path/to/protractor'})

      expect(spawnStub).to.have.been.calledWith('node', ['/arbitrary/path/to/protractor'])
    })

    it('allows a different path for node by using nodeBin option', () => {
      protractorFlake({nodeBin: '/path/node'})

      expect(spawnStub).to.have.been.calledWith('/path/node', [pathToProtractor()])
    })

    it('passes protractorArgs to spawned protractor process', () => {
      protractorFlake({protractorArgs: ['--suite=fail']})

      expect(spawnStub).to.have.been.calledWithMatch('node', [pathToProtractor(), '--suite=fail'])
    })

    it('uses protractorSpawnOptions for spawned protractor process', () => {
      protractorFlake({protractorSpawnOptions: { cwd: './' }})

      expect(spawnStub).to.have.been.calledWithMatch('node', [pathToProtractor()], { cwd: './' })
    })
  })

  context('retryArgs', () => {

    it('does not use retryArgs with only 1 attempt', function () {
      protractorFlake({
        maxAttempts: 1,
        retryArgs: '--shouldNotBePassed=true'
      });

      spawnStub.dataCallback(failedShardedTestOutput);
      spawnStub.endCallback(1);

      expect(spawnStub).to.have.been.calledWith('node', [
        pathToProtractor()
      ]);
    });

    it('passes retryArgs with 2 or more attempts as a string', function () {
      protractorFlake({
        maxAttempts: 2,
        retryArgs: '--shouldBePassed=true,--shouldNotBePassed=false'
      });

      spawnStub.dataCallback(failedShardedTestOutput);
      spawnStub.endCallback(1);

      expect(spawnStub).to.have.been.calledWith('node', [
        pathToProtractor(),
        '--specs', '/tests/a-flakey.test.js,/tests/another-flakey.test.js',
        '--shouldBePassed=true', '--shouldNotBePassed=false'
      ]);
    });

    it('passes retryArgs with 2 or more attempts as an array', function () {
      protractorFlake({
        maxAttempts: 3,
        retryArgs: ['--shouldNotBePassed=false', '--shouldBePassed=true']
      });

      spawnStub.dataCallback(failedShardedTestOutput);
      spawnStub.endCallback(1);

      expect(spawnStub).to.have.been.calledWith('node', [
        pathToProtractor(),
        '--specs', '/tests/a-flakey.test.js,/tests/another-flakey.test.js',
        '--shouldNotBePassed=false',
        '--shouldBePassed=true'
      ]);
    });

  });
})

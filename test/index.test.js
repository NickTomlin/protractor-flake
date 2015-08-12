import proxyquire from 'proxyquire';
import {spawn} from 'child_process';

describe('Protractor Flake', () => {
  describe.only('failed specs', () => {
    let spawnStub = null;
    let protractorFlake = null;

    beforeEach(() => {
      spawnStub = sinon.stub().returns({
        stdout: {
          on: sinon.stub()
        },
        on (event, callback) {
          if (event === 'exit') {
            spawnStub.endCallback = callback;
          }
        },
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
  });
});

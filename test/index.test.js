import proxyquire from 'proxyquire';
import {spawn} from 'child_process';

describe('Protractor Flake', function () {
  describe('failed specs', function () {
    it.only('reruns individual failed protractor specs', function () {
      let spawnSpy = sinon.stub().returns({
        on: function (event, callback) {
          spawnSpy.endCallback = callback;
        },
      });

      let protractorFlake = proxyquire('../src/index', {
        child_process: {
          spawn: spawnSpy
        }
      });

      protractorFlake({protractorPath: 'protractor'});

      expect(spawnSpy).to.have.been.calledWithMatch('protractor');
    });
  });
});

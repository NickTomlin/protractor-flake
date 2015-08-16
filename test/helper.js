import sinon from 'sinon';
import chai from 'chai';

chai.use(require('sinon-chai'));

global.expect = chai.expect;
global.sinon = sinon;
global.sandbox = sinon.sandbox.create();

if (process.env.PROTRACTOR_FLAKE_LOG_LEVEL === undefined) {
  process.env.PROTRACTOR_FLAKE_LOG_LEVEL = 'silent';
}

afterEach(function () {
  global.sandbox.restore();
});

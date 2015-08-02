import sinon from 'sinon';
import chai from 'chai';

chai.use(require('sinon-chai'));

global.expect = chai.expect;
global.sinon = sinon;
global.sandbox = sinon.sandbox.create();

afterEach(function () {
  global.sandbox.restore();
});


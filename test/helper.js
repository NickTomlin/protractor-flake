import sinon from 'sinon';
import chai from 'chai';
import server from './support/server';

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


before((done) => {
  server.listen(process.env.PORT || '3000', () => {
    console.log('listening at ', port);
    done();
  });
});

after(() => {
  server.close();
});

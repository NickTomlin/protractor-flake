///<reference path="globals.d.ts" />

import * as Sinon from 'sinon'
import * as chai from 'chai'
import 'mocha'

chai.use(require('sinon-chai'))

global.expect = chai.expect
global.sinon = Sinon
global.sandbox = Sinon.createSandbox()

if (!process.env.PROTRACTOR_FLAKE_LOG_LEVEL) {
  process.env.PROTRACTOR_FLAKE_LOG_LEVEL = 'silent'
}

afterEach(function () {
  global.sandbox.restore()
})

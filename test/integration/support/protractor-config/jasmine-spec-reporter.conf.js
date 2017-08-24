'use strict';

var JOB_NUMBER = (process.env.TRAVIS_JOB_NUMBER || '')
var JOB_NAME = 'Flake' + JOB_NUMBER

exports.config = {
  specs: [
    '../flakey-test.js',
    '../passing-test.js'
  ],

  capabilities: {
    browserName: 'chrome',
    name: JOB_NAME,
    shardTestFiles: false,
    maxInstances: 2,
    'tunnel-identifier': JOB_NUMBER
  },

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  baseUrl: 'http://localhost:3000/',

  framework: 'jasmine2',

  allScriptsTimeout: 10000,

  getPageTimeout: 3000,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 5000,
    print: function() {} // remove dot reporter
  },

  onPrepare: function () {
    // let protractor know it doesn't need to look for angular on the page
    browser.ignoreSynchronization = true;

    // make reports mo' pretty
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true
        }
      })
    );
  }
};


'use strict';

require('babel/register');

var JOB_NAME = 'Flake';

exports.config = {
  specs: [
    '../*.test.js'
  ],

  capabilities: {
    browserName: 'firefox',
    name: JOB_NAME,
    shardTestFiles: true,
    maxInstances: 2
  },

  baseUrl: 'http://localhost:3000/',

  directConnect: true,

  framework: 'jasmine',

  allScriptsTimeout: 10000,

  getPageTimeout: 3000,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 5000
  },

  onPrepare: function () {
    // let protractor know it doesn't need to look for angular on the page
    browser.ignoreSynchronization = true;
  }
};


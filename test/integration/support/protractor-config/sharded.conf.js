const puppeteer = require('puppeteer')

exports.config = {
  specs: [
    '../flakey-test.js',
    '../passing-test.js'
  ],

  directConnect: true,
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2,
    chromeOptions: {
      args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
      binary: puppeteer.executablePath()
    }
  },

  baseUrl: 'http://localhost:3000/',

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


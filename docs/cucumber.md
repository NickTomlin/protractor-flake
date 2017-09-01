# Cucumberjs parser

## Intro
There are multiple version of CucumberJS that all differ a bit in the way they log failures. This parser will parse the log based on 2 log lines. That combination will determine if a `*.feature`-file needs to be run again.
The 2 log lines are

- `Failures:`
- `Specs: /path/to/your/featurefile/flaky.feature`.

The `Failures` log line is always printed on failed scenario's. The `Specs: /path/to/your/featurefile/flaky.feature` is not always printed, due to the capability settings in the Protractor configuration. See [here](#capability-configuration)


## Usage
The following 2 things need to be done to get the parser working

### Configure protractor-flake
Via the CLI:
```shell
// how to use the `cucumber`-parser
protractor-flake --protractor-path=/path/to/protractor --parser cucumber --node-bin node --max-attempts=3 -- path/to/protractor.conf.js
```

Or programmatically:

```js
var protractorFlake = require('protractor-flake');

// Default Options
protractorFlake({
  parser: 'cucumber'
}, function (status, output) {
  proces.exit(status)
})
```

### Add a `Specs: ..` log statement
Depending on the version of CucumberJS that is used 1 of the hooks defined below can be used. This can be saved to a file like for example `afterHooks.js`. Make sure that this file is required in the `protractor.conf.js` file like this

```js
cucumberOpts: {
    require: [
        'path/to/your/afterHooks.js'
    ]
}
```

This will **always** print the `Specs:` in the testoutput when a scenario fails. The parser will filter double specs.

#### Version 1
```js
'use strict';

module.exports = function () {
    this.After(function (scenarioResult) {
        if (scenarioResult.isFailed()) {
            // Log the spec to the console for protractor-flake to be able to rerun the failed specs
            console.log('Specs:', scenarioResult.getUri());
        }

        return Promise.resolve();
    });
};
```

#### Version 2
```js
'use strict';

const {defineSupportCode} = require('cucumber');

defineSupportCode(({After}) => {
    After(function (scenarioResult) {
        if (scenarioResult.status === 'failed') {
            // Log the spec to the console for protractor-flake to be able to rerun the failed specs
            console.log('Specs:', scenarioResult.scenario.uri);
        }

        return Promise.resolve();
    });
});
```

#### Version 3
```js
'use strict';

const {defineSupportCode, Status} = require('cucumber');

defineSupportCode(({After}) => {
    After(function (testCase) {
        if (testCase.result.status === Status.FAILED) {
            // Log the spec to the console for protractor-flake to be able to rerun the failed specs
            console.log('Specs:', testCase.sourceLocation.uri);
        }

        return Promise.resolve();
    });
});
```

## Capability configuration
Based on the way the capability in Protractor has been configured the `Specs:` are printed. See the table below for the results.

```
// Single
capabilities: {
    browserName: 'chrome',
    shardTestFiles: true
}
// Multi
multiCapabilities = [
    {
        browserName: 'chrome',
        shardTestFiles: true
    },
    {
        browserName: 'firefox',
        shardTestFiles: true
    }
]
```

| Capability | shardTestFiles | Feature | Failures | Specs printed |
| :--------: | :------------: | :-----: | :------: | :-----------: |
|  single    |      true      |    1    |   true   |     false     |
|  single    |     false      |    1    |   true   |     false     |
|  single    |      true      |    1    |  false   |     false     |
|  single    |     false      |    1    |  false   |     false     |
|  single    |      true      |   >1    |   true   |    **TRUE**   |
|  single    |     false      |   >1    |   true   |     false     |
|  single    |      true      |   >1    |  false   |    **TRUE**   |
|  single    |     false      |   >1    |  false   |     false     |
|  multi     |      true      |    1    |   true   |    **TRUE**   |
|  multi     |     false      |    1    |   true   |    **TRUE**   |
|  multi     |      true      |    1    |  false   |    **TRUE**   |
|  multi     |     false      |    1    |  false   |    **TRUE**   |
|  multi     |      true      |   >1    |   true   |    **TRUE**   |
|  multi     |     false      |   >1    |   true   |   **FALSE**   |
|  multi     |      true      |   >1    |  false   |    **TRUE**   |
|  multi     |     false      |   >1    |  false   |     false     |

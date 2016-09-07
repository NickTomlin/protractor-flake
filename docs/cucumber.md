
# Cucumberjs parser

## cucumber
> This parser only works with `cucumberjs` version < v0.9.0

The `cucumber` parser will search the testoutput for this piece of text `/path/to/your/featurefile/flakey.feature:4 # Scenario: Flakey scenario`. This is the line that says that a scenario in a featurefile failed.
The `/path/to/your/featurefile/flakey.feature` piece will be stripped out and passed to `protractor-flake` to rerun the file(s) for the amount of retries that have been given.

## cucumberMulti
> This parser is based on `cucumberjs` > v0.9.0. These versions have a different logging and also a different way in returning the path of the runned specs. (See example [logging](test/unit/support/fixtures/cucumberjs/)).

> **This parser can parse testoutput from `capabilities` and `multiCapabilities`**

The `cucumberMulti` parser will search the testoutput for the text combination `Failures:`and `Specs: /path/to/your/featurefile/flakey.feature`. 
The parser needs to search for both pieces of text because succeeded specs are also being logged.
The `/path/to/your/featurefile/flakey.feature` piece will be stripped out and passed to `protractor-flake` to rerun the file(s) for the amount of retries that have been given.

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

When no `Specs:` are printed in the logging Protractor will run the Protractor command again which means that all the specs are run on **ALL** the instances (also the succeeded specs).
  
### Always print specs
There is a way to always print `Specs:`. This can be done with the following hook, see [cucumberjs](https://github.com/cucumber/cucumber-js) for more hook info:

```
var afterHook = function () {
  this.After(function (scenario, callback) {
        if (scenario.isFailed()) {
            console.log('Specs:', scenario.getUri());
        }
        callback();
  });
};

module.exports = afterHook;
```

This will always print the `Specs:` in the testoutput. The parser will filter double specs. 

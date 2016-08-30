Protractor Flake [![Build Status](http://img.shields.io/travis/NickTomlin/protractor-flake/master.svg?style=flat)](https://travis-ci.org/NickTomlin/protractor-flake) ![NPM package](https://img.shields.io/npm/v/protractor-flake.svg) [![Join the chat at https://gitter.im/NickTomlin/protractor-flake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/NickTomlin/protractor-flake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
===

Rerun potentially flakey protractor tests before failing.

```shell
npm i protractor-flake

# or globally for easier cli usage
npm i -g protractor-flake
```

# Usage

Via the CLI:

```shell
npm i -g protractor-flake

# Default options
protractor-flake

# Full options
# protractor-flake <protractor-flake-options> -- <options to be passed to protractor>
protractor-flake --protractor-path=/path/to/protractor --parser standard --node-bin node --max-attempts=3 -- path/to/protractor.conf.js
```

Protractor flake expects `protractor` to be on $PATH by default, but you can use the `--protractor-path` argument to point to the protractor executable.

Or programmatically:

```javascript
var protractorFlake = require('protractor-flake');

// Default Options
protractorFlake({
  parser: 'standard'
}, function (status, output) {
  proces.exit(status)
})

// Full Options
protractorFlake({
  protractorPath: '/path/to/protractor',
  maxAttempts: 3,
  parser: 'standard',
  // expects node to be in path
  // set this to wherever the node bin is located
  nodeBin: 'node',
  protractorArgs: []
}, function (status, output) {
  process.exit(status);
});

```

### Parsers

Protractor flake defaults to using the `standard` parser, which will typically pick up failures run from non-sharded/multi-capability test runs using Jasmine 1 + 2 and Mocha.

You can override this with the `parser` option, specifying one of the [built in parsers](src/parsers/index.js).

#### Cucumberjs parser
Cucumberjs > v0.9.0 has a different logging and also a differen way in returning the path of the runned specs. (See example [logging](test/unit/support/fixtures/cucumberjs)). Based on the way the capability in Protractor has been configured the `Specs:` are printed. See the table below for the results.

| Capability | shardTestFiles | Feature | Failures | Specs printed |
| :--------: | :------------: | :-----: | :------: | :-----------: |
|  single    |      true      |    1    |   true   |     false     |
|  single    |     false      |    1    |   true   |     false     |
|  single    |      true      |    1    |  false   |     false     |
|  single    |     false      |    1    |  false   |     false     |
|  single    |      true      |   >1    |   true   |    **true**   |
|  single    |     false      |   >1    |   true   |     false     |
|  single    |      true      |   >1    |  false   |    **true**   |
|  single    |     false      |   >1    |  false   |     false     |
|  multi     |      true      |    1    |   true   |    **true**   |
|  multi     |     false      |    1    |   true   |    **true**   |
|  multi     |      true      |    1    |  false   |    **true**   |
|  multi     |     false      |    1    |  false   |    **true**   |
|  multi     |      true      |   >1    |   true   |    **true**   |
|  multi     |     false      |   >1    |   true   |   **false**   |
|  multi     |      true      |   >1    |  false   |    **true**   |
|  multi     |     false      |   >1    |  false   |     false     |

When no `Specs:` are printed in the logging Protractor will run the Protractor command again which means that all the specs are run on all the instances (also the succeeded specs).

# Caveats

This has not yet been tested with Protractor + Mocha. It _should_ function similarly. Please update with an issue or PR if this is not the case.

Tests will not re-run properly (all tests will run each time) if you use a custom reporter that does not log stacktraces for failed tests. For example, if you are using jasmine-spec-reporter with Jasmine 2.0, make sure to set `displayStacktrace: 'specs'` or `displayStacktrace: 'all'`.

# Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md)

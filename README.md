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
protractor-flake --protractor-path=/path/to/protractor --parser standard --node-bin node --max-attempts=3 --retryArgs= -- path/to/protractor.conf.js
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
  protractorArgs: [],
  retryArgs: []
}, function (status, output) {
  process.exit(status);
});

```

### Parsers

Protractor flake defaults to using the `standard` parser, which will typically pick up failures run from non-sharded/multi-capability test runs using Jasmine 1 + 2 and Mocha.

You can override this with the `parser` option, specifying one of the [built in parsers](src/parsers/index.js).

#### Parser documentation
- Mocha (TODO)
- Jasmine (TODO)
- [cucumber](docs/cucumber.md)

### Additional Flags

#### retryArgs
Allows the user to pass arguments to protractor when re-running failed specs. `Accepts an array of strings or comma delimited string`

# Caveats

This has not yet been tested with Protractor + Mocha. It _should_ function similarly. Please update with an issue or PR if this is not the case.

Tests will not re-run properly (all tests will run each time) if you use a custom reporter that does not log stacktraces for failed tests. For example, if you are using jasmine-spec-reporter with Jasmine 2.0, make sure to set `displayStacktrace: 'specs'` or `displayStacktrace: 'all'`.

# Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md)

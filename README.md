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

# protractor-flake <protractor-flake-options> -- <options to be passed to protractor>
protractor-flake --parser standard  --max-attempts=3 -- path/to/protractor.conf.js
```

See [src/options.js](src/options.js#L4-L15) for the full list of command line options.

Protractor flake expects `protractor` to be on $PATH by default, but you can use the `--protractor-path` argument to point to the protractor executable.

Or programmatically:

```javascript
// using commonjs:
var protractorFlake = require('protractor-flake')
// OR using es6 modules/typescript
import protractorFlake = require('protractor-flake')

// Default Options
protractorFlake({
  parser: 'standard'
}, function (status, output) {
  process.exit(status)
})

// Full Options
protractorFlake({
  protractorPath: '/path/to/protractor',
  maxAttempts: 3,
  parser: 'standard',
  // expects node to be in path
  // set this to wherever the node bin is located
  nodeBin: 'node',
  // set color to one of the colors available at 'chalk' - https://github.com/chalk/ansi-styles#colors
  color: 'magenta',
  protractorArgs: [],
  // specify a different protractor config to apply after the first execution attempt
  // either specify a config file, or cli args (ex. --capabilities.browser=chrome)
  protractorRetryConfig: 'path/to/<protractor-retry-config>.js' 
}, function (status, output) {
  process.exit(status)
})

```

### Parsers

Protractor flake defaults to using the `standard` parser, which will typically pick up failures run from non-sharded/multi-capability test runs using Jasmine 1 + 2 and Mocha.

There are a few other ways that you can customize your parsing:

- overriding this with the `parser` option, specifying one of the [built in parsers](src/parsers/index.js).
- providing a path to a module (e.g. `/my/module.js` or `./module.js`) that exports a [parser](test/unit/support/custom-parser.js)
- a parser (if used programatically)

Parsers should be defined as an object with a `parse` method (and optionally a `name` property):

```javascript
module.exports = {
  name: 'my-custom-parser',
  parse (protractorTestOutput) {
    let failedSpecs = new Set()
    // ... analyze protractor test output
    // ... and add to specFiles
    failedSpecs.add('path/to/failed/specfile')

    // specFiles to be re-run by protractor-flake
    // if an empty array is returned, all specs will be re-run
    return [...failedSpecs]
  }
}
```

```typescript
import Parser from 'protractor-flake/lib/parsers/parser'

const MyParser: Parser = {
  name: 'my-custom-parser',
  parse (protractorTestOutput) {
    let failedSpecs = new Set()
    // ... analyze protractor test output
    // ... and add to specFiles
    failedSpecs.add('path/to/failed/specfile')

    // specFiles to be re-run by protractor-flake
    // if an empty array is returned, all specs will be re-run
    return [...failedSpecs]
  }
}

exports = MyParser
```

#### Parser documentation
- Mocha (TODO)
- Jasmine (TODO)
- [cucumber](docs/cucumber.md)

# Caveats

This has not yet been tested with Protractor + Mocha. It _should_ function similarly. Please update with an issue or PR if this is not the case.

Tests will not re-run properly (all tests will run each time) if you use a custom reporter that does not log stacktraces for failed tests. For example, if you are using jasmine-spec-reporter with Jasmine 2.0, make sure to set `displayStacktrace: 'specs'` or `displayStacktrace: 'all'`.

# Contributors

See [CONTRIBUTING.md](CONTRIBUTING.md)

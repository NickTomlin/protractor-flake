Protractor Flake

---
[![Build Status](http://img.shields.io/travis/NickTomlin/protractor-flake.svg?style=flat&branch=master)](https://travis-ci.org/NickTomlin/protractor-flake)
![NPM package](https://img.shields.io/npm/v/protractor-flake.svg)

Rerun potentially flakey protractor tests before failing.

> This module is still 0.x so please contribute a PR or issue if you encounter any bugs.

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
protractor-flake --protractor-path ./node_modules/.bin/protractor --max-attempts=3 -- protractor.conf.js
```

Protractor flake expects `protractor` to be on $PATH by default, but you can use the `--protractor-path` argument to point to the protractor executable.

Or programmatically:

```javascript
var protractorFlake = require('protractor-flake');

protractorFlake({
  maxAttempts: 3,
  // expects protractor to be in path
  // set this to wherever the protractor bin
  // is located
  protractorPath: 'protractor',
  protractorArgs: []
}, function (status, output) {
  process.exit(status);
});

```

# Caveats

This has not yet been tested with Protractor + Mocha. It _should_ function similarly. Please update with an issue or PR if this is not the case.

# Contributors

```
# clone this repository
npm i

# run the tests
npm t

# run unit tests in watch mode
npm run test:dev

# run unit integration tests
npm run test:integration
```

Please try to add test coverage for any new features.

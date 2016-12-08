Getting started:

```
# clone this repository
npm i

# run the tests
npm t

# run unit tests in watch mode
npm run test:dev

# run unit integration tests using sauce (this requires a valid SAUCE_ACCESS_KEY and SAUCE_USERNAME to be on the environment)
# feel free to omit this step; it will be run when you pull request your changes
npm run test:integration
```

This module uses [semantic release](https://github.com/semantic-release/semantic-release) to automate the publication of new changes. To allow this to happen, your commit message should follow the [angular.js conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit). Put simply, prefix your commit message with `feat:`, `fix:`, or `chore:` depending on the nature of the change e.g. `feat: add support for magic.js`, `fix: correct typo in error message`, `chore: fix update README`.

Please add or update a test to cover your fix or feature.

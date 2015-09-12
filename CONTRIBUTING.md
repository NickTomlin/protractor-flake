Getting started:

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

This module uses [semantic release](https://github.com/semantic-release/semantic-release) to automate the publication of new changes. To allow this to happen, your commit message should follow the [angular.js conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit). Put simply, prefix your commit message with `feat:`, `fix:`, or `fix` depending on the nature of the change e.g. `feat: add support for magic.js`, `fix: correct typo`, `fix update README`.

Please try to add test coverage for any new features.

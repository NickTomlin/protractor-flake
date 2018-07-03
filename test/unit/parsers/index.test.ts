///<reference path="../../globals.d.ts" />

import { resolve } from 'path'
import { all, getParser } from '../../../src/parsers'
import Parser from '../../../src/parsers/parser'
import standardParser from '../../../src/parsers/standard'
import cucumberParser from '../../../src/parsers/cucumber'
import multiParser from '../../../src/parsers/multi'

const customParser = require('../support/custom-parser')

describe('parsers', () => {
  describe('#getParser', () => {
    context('with a name provided', () => {
      it('throws an error if an invalid parser name is specified', () => {
        expect(() => {
          getParser('not-a-parser')
        }).to.throw(/Invalid Parser Specified: not-a-parser/)
      })

      it('throws an error if no parser name is specified', () => {
        expect(() => {
          getParser()
        }).to.throw(/Invalid Parser Specified: /)
      })

      it('returns a standard parser if specified', () => {
        let returnedParser = getParser('standard')
        expect(returnedParser).to.eq(standardParser)
      })

      it('returns a multi parser if specified', () => {
        let returnedParser = getParser('multi')
        expect(returnedParser).to.eq(multiParser)
      })

      it('returns a cucumber parser if specified', () => {
        let returnedParser = getParser('cucumber')
        expect(returnedParser).to.eq(cucumberParser)
      })
    })

    context('with a "path" provided', () => {
      it('requires a module at the given path', () => {
        let customParserPath = resolve(__dirname, '../support/custom-parser.js')
        let returnedParser = getParser(customParserPath)

        expect(returnedParser).to.eq(customParser)
      })

      it('throws an invalid parser error if module does not exist', () => {
        let customParserPath = resolve(__dirname, '../support/nonexistantparser.js')

        expect(() => {
          getParser(customParserPath)
        }).to.throw(new RegExp(`Invalid Custom Parser Path Specified: ${customParserPath}`))
      })
    })

    context('with a parser object provided', () => {
      it('returns the object', () => {
        expect(getParser(customParser)).to.eq(customParser)
      })

      it('throws an error if object does not supply a parse function', () => {
        expect(() => {
          getParser({ parse: 'not a function dawg' } as any)
        }).to.throw(`Invalid Parser Object specified. Your parser must define a \`parse\` method`)
      })
    })
  })
})

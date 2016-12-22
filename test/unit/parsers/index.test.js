import { resolve } from 'path'
import customParser from '../support/custom-parser'
import parsers from '../../../src/parsers'
import standardParser from '../../../src/parsers/standard'
import cucumberParser from '../../../src/parsers/cucumber'
import multiParser from '../../../src/parsers/multi'

describe('parsers', () => {
  describe('#getParser', () => {
    context('with a name provided', () => {
      it('allows overriding parser with parserName option', () => {
        let fakeParser = {
          name: 'fake',
          test () {
            return false
          }
        }
        parsers.all.fake = fakeParser

        let returnedParser = parsers.getParser('fake')
        expect(returnedParser).to.eql(fakeParser)
      })

      it('throws an error if an invalid parser name is specified', () => {
        expect(() => {
          parsers.getParser('not-a-parser', 'fake-output')
        }).to.throw(/Invalid Parser Specified: not-a-parser/)
      })

      it('throws an error if no parser name is specified', () => {
        expect(() => {
          parsers.getParser()
        }).to.throw(/Invalid Parser Specified: /)
      })

      it('returns a standard parser if specified', () => {
        let returnedParser = parsers.getParser('standard')
        expect(returnedParser).to.eq(standardParser)
      })

      it('returns a multi parser if specified', () => {
        let returnedParser = parsers.getParser('multi')
        expect(returnedParser).to.eq(multiParser)
      })

      it('returns a cucumber parser if specified', () => {
        let returnedParser = parsers.getParser('cucumber')
        expect(returnedParser).to.eq(cucumberParser)
      })
    })

    context('with a "path" provided', () => {
      it('requires a module at the given path', () => {
        let customParserPath = resolve(__dirname, '../support/custom-parser.js')
        let returnedParser = parsers.getParser(customParserPath)

        expect(returnedParser).to.eq(customParser)
      })

      it('throws an invalid parser error if module does not exist', () => {
        let customParserPath = resolve(__dirname, '../support/nonexistantparser.js')

        expect(() => {
          parsers.getParser(customParserPath)
        }).to.throw(new RegExp(`Invalid Custom Parser Path Specified: ${customParserPath}`))
      })
    })

    context('with a parser object provided', () => {
      it('returns the object', () => {
        expect(parsers.getParser(customParser)).to.eq(customParser)
      })

      it('throws an error if object does not supply a parse function', () => {
        expect(() => {
          parsers.getParser({
            parse: 'not a function dawg'
          })
        }).to.throw(`Invalid Parser Object specified. Your parser must define a \`parse\` method`)
      })
    })
  })
})

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
  })
})

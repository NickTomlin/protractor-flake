import parsers from '../../../src/parsers'
import standardParser from '../../../src/parsers/standard'

describe('parsers', () => {
  describe('#getParser', () => {
    context('with a name provided', () => {
      it('allows overriding parser with parserName option', () => {
        let fakeParser = {
          name: 'fakeParser',
          test () {
            return false
          }
        }
        parsers.all.unshift(fakeParser)

        let returnedParser = parsers.getParser('fakeParser')
        expect(returnedParser).to.eql(fakeParser)
      })

      it('throws an error if an invalid parser name is specified', () => {
        expect(() => {
          parsers.getParser('not-a-parser', 'fake-output')
        }).to.throw(/Invalid Parser Specified: not-a-parser/)
      })
    })

    context('without a name', () => {
      it('defaults to the standardParser if no name is provided and no parser test passes', () => {
        let returnedParser = parsers.getParser(false, 'fake-output')
        expect(returnedParser).to.eql(standardParser)
      })

      it('returns the first matching parser', () => {
        let fakeParser = {
          name: 'fakeParser',
          test (output) {
            return /YAY/.test(output)
          }
        }
        parsers.all.unshift(fakeParser)

        let returnedParser = parsers.getParser(false, 'some YAY output')
        expect(returnedParser).to.eq(fakeParser)
      })
    })
  })
})

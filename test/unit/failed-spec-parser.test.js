import failedSpecParser from '../../src/failed-spec-parser'
import parsers from '../../src/parsers'

describe('failed spec parser', () => {
  it('allows overriding parser with parserName option', () => {
    let fakeParser = {
      parse (specs) {
        return specs
      }
    }
    sandbox.spy(fakeParser, 'parse')
    let findStub = sandbox.stub(parsers, 'find').returns(fakeParser)

    failedSpecParser('<fake output>', 'standardParser')

    expect(findStub).to.have.been.calledWith('standardParser')
    expect(fakeParser.parse).to.have.been.calledWith(new Set(), '<fake output>')
  })
})

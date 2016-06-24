import readFixture from './support/read-fixture'
import failedSpecParser from '../src/failed-spec-parser'

describe('failed spec parser', () => {
  it('properly identifies failed spec files', () => {
    let output = readFixture('failed-test-output.txt')

    expect(failedSpecParser(output)).to.eql([
      '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js'
    ])
  })

  it('properly identifies failed spec files for sharded output', () => {
    let output = readFixture('sharded-failed-test-output.txt')

    expect(failedSpecParser(output)).to.eql([
      '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js',
      '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js'
    ])
  })

  it('properly identifies failed cucumberjs feature files', () => {
    let output = readFixture('failed-cucumberjs-output.txt')

    expect(failedSpecParser(output)).to.eql([
      '/Users/jrust/code/features/automated/fail.feature'
    ])
  })

  it('handles output on windows', function () {
    let output = readFixture('failed-windows-test-output.txt')

    expect(failedSpecParser(output)).to.eql([
      'd:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\a-flakey.test.js',
      'C:\\Users\\IEUser\\Documents\\protractor-flake-master\\test\\support\\another-flakey.test.js'
    ])
  })

  it('does not duplicate specs with multicapabilities output', () => {
    let output = readFixture('multicapabilities-failed-test-output.txt')

    expect(failedSpecParser(output)).to.eql([
      '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js',
      '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js'
    ])
  })

  it('properly handles large line numbers', () => {
    let output = `
    at [object Object].<anonymous> (/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js:999:102)

    Finished in 0.538 seconds
    [31m1 test, 1 assertion, 1 failure
    [0m
    `

    expect(failedSpecParser(output)).to.eql([
      '/Users/ntomlin/workspace/protractor-flake/test/support/a-flakey.test.js'
    ])
  })

  it('returns an empty array if output has no matches', () => {
    let output = `
      Wow
      Much Text   Wow
      So whitespace
      object Object
      Wow
    `

    expect(failedSpecParser(output)).to.eql([])
  })

  it('returns an empty array if cucumberjs output has no matches', () => {
    let output = readFixture('success-cucumberjs-output.txt')

    expect(failedSpecParser(output)).to.eql([])
  })

  it('properly handles jasmine2 output', function () {
    let output = readFixture('failed-jasmine2-test-output.txt')

    expect(failedSpecParser(output)).to.eql([
      '/Users/ntomlin/workspace/protractor-flake/test/support/another-flakey.test.js',
      '/Users/ntomlin/workspace/protractor-flake/test/support/flakey.test.js'
    ])
  })

  it('clears failedspecs if an UnknownError occurs', () => {
    let output = readFixture('sharded-unknown-test-output.txt')

    expect(failedSpecParser(output)).to.eql([])
  })
})

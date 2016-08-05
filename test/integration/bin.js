import server from './support/server'
import { unlink } from 'fs'
import { resolve } from 'path'
import { spawn } from 'child_process'

const FLAKE_FILE = resolve(__dirname + '/../support/times-flaked')
const CONFIG_DIR = resolve(__dirname, 'support/protractor-config')

function configPath (filename) {
  return `${CONFIG_DIR}/${filename}.conf.js`
}

function spawnFlake (flakeArgs = []) {
  let proc = spawn('./bin/protractor-flake', flakeArgs)
  proc.stdout.on('data', (buff) => {
    process.stdout.write(buff.toString())
  })

  proc.stderr.on('data', (x) => {
    process.stdout.write(x.toString())
  })

  return proc
}

describe('Protractor Flake Executable', function () {
  before((done) => {
    server.listen({port: process.env.PORT}, () => {
      done()
    })
  })

  after(() => {
    server.close()
  })

  beforeEach((done) => {
    unlink(FLAKE_FILE, function (err) {
      if (err && err.code !== 'ENOENT') {
        return done(err)
      }

      done()
    })
  })

  it('integration: Exits successfully if test passes before max limit is reached', (done) => {
    let proc = spawnFlake(['--max-attempts', '3', '--', configPath('sharded')])
    proc.on('close', (status) => {
      expect(status).to.equal(0)
      done()
    })
  })

  it('integration: exits unsuccessfully if test fails outside of max limit', (done) => {
    let proc = spawnFlake(['--max-attempts', '1', '--', configPath('always-fail')])
    proc.on('close', (status) => {
      expect(status).to.equal(1)
      done()
    })
  })

  it('integration: exits with error if invalid parser is specified', (done) => {
    let output = ''
    let proc = spawnFlake(['--max-attempts', '3', '--parser', 'foo', '--', configPath('sharded')])
    proc.stderr.on('data', (buff) => {
      output += buff.toString()
    })

    proc.on('close', (status) => {
      expect(status).to.equal(1)
      expect(output).to.contain('Error: Invalid Parser Specified: foo')
      done()
    })
  })
})

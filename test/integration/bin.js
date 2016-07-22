import server from '../support/server'
import { unlink } from 'fs'
import { resolve } from 'path'
import { spawn } from 'child_process'

const FLAKE_FILE = resolve(__dirname + '/../support/times-flaked')
const CONFIG_PATH = 'test/support/protractor-config'
const SINGLE_INSTANCE_PATH = `${CONFIG_PATH}/protractor-sharded.conf.js`

// NOTE: until tagging support lands in mocha, all integration it()'s must be prefaced with integration:
// because I am lazy an don't want to overcomplicate test setup
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
    let proc = spawn('./bin/protractor-flake', ['--max-attempts', '3', '--', SINGLE_INSTANCE_PATH])

    proc.on('close', (status) => {
      expect(status).to.equal(0)
      done()
    })
  })

  it('integration: exits unsuccessfully if test fails outside of max limit', (done) => {
    let proc = spawn('./bin/protractor-flake', ['--max-attempts', '1', '--', SINGLE_INSTANCE_PATH])

    proc.on('close', (status) => {
      expect(status).to.equal(1)
      done()
    })
  })
})

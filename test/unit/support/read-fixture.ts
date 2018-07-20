import { readFileSync } from 'fs'
import { resolve } from 'path'

export default function readFixture (fixtureFile: string) {
  return readFileSync(resolve(__dirname, `./fixtures/${fixtureFile}`), 'utf8')
}

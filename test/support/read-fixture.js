import {readFileSync} from 'fs';
import {resolve} from 'path';

export default function readFixture (fixtureFile) {
  return readFileSync(resolve(__dirname, `./fixtures/${fixtureFile}`), 'utf8');
}

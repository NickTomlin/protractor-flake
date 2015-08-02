import {spawn} from 'child_process';

export default function (args = [], callback) {
  var output = '';
  var flakedProcess = spawn('bin/protractor-flake', args);

  flakedProcess.stdout.on('data', (data) => {
    output = output + data.toString();
  });

  flakedProcess.stderr.on('data', (err) => {
    callback(err, null);
  });

  flakedProcess.on('close', (status) => {
    callback(null, status, output);
  });
}

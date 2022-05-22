const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdin, stdout } = require('process');

const pathOutputFile = join(__dirname, 'text.txt');
const output = createWriteStream(pathOutputFile);

stdout.write('Type in anything ("exit", "Ctrl+C"): ');

stdin.on('data', data => {
  if (data.toString().trim() == 'exit') {
    process.exit();
  }
  output.write(data);
  stdout.write('Type in anything ("exit", "Ctrl+C"): ');
});

process.on('SIGINT', () => {
  stdout.write(' exit\n');
  process.exit();
});
process.on('exit', () => stdout.write('Program completed.'));

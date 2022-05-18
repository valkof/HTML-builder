const fs = require('fs');
const path = require('path');

const pathOutputFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathOutputFile);

const { stdin, stdout } = process;

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
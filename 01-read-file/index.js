const { createReadStream } = require('fs');
const { join } = require('path');

const pathFile = join(__dirname, 'text.txt');
const stream = createReadStream(pathFile, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));

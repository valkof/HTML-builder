const { createWriteStream, createReadStream } = require('fs');
const { readdir } = require('fs/promises');
const { join, extname } = require('path');

const pathCurrentDir = join(__dirname, 'styles');
const pathBundleDir = join(__dirname, 'project-dist');

const pathBundleFile = join(pathBundleDir, 'bundle.css');
const outputStream = createWriteStream(pathBundleFile);

async function bundle() {
  const files = await readdir(pathCurrentDir, {withFileTypes: true}).then(dirents => {
    return dirents.filter(dirent => dirent.isFile() && extname(dirent.name) == '.css'); 
  });
  for (const file of files) {
    const inputFile = join(pathCurrentDir, file.name);
    const inputStream = createReadStream(inputFile, 'utf-8');
    inputStream.pipe(outputStream);
  }
}

bundle();
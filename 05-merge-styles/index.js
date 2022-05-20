const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const pathCurrentDir = path.join(__dirname, 'styles');
const pathBundleDir = path.join(__dirname, 'project-dist');

const pathBundleFile = path.join(pathBundleDir, 'bundle.css');
const outputStream = fs.createWriteStream(pathBundleFile);

async function bundle() {
  const dirents = await readdir(pathCurrentDir, {withFileTypes: true});
  for (const dirent of dirents) {
    if (dirent.isFile() && path.parse(dirent.name).ext == '.css') {
      const inputFile = path.join(pathCurrentDir, dirent.name);
      const inputStream = fs.createReadStream(inputFile, 'utf-8');
      inputStream.pipe(outputStream);
    }
  }
}

bundle();
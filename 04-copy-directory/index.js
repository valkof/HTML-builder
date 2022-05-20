const { copyFile, mkdir, readdir, rm } = require('fs/promises');
const path = require('path');

const pathDir = path.join(__dirname, 'files');
const pathCopyDir = path.join(__dirname, 'files-copy');

mkdir(pathCopyDir, {recursive: true});

async function delFiles () {
  const dirents = await readdir(pathCopyDir, {withFileTypes: true});
  for (const dirent of dirents) {
    await rm(path.join(pathCopyDir, dirent.name));
  }
}

async function copyFiles () {
  const dirents = await readdir(pathDir, {withFileTypes: true});
  for (const dirent of dirents) {
    if (dirent.isFile()) {
      await copyFile(path.join(pathDir, dirent.name), path.join(pathCopyDir, dirent.name));
    }
  }
}

(async () => {
  await delFiles();
  await copyFiles();
})();

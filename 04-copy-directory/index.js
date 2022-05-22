const { copyFile, mkdir, readdir, rm } = require('fs/promises');
const { join } = require('path');

const pathDir = join(__dirname, 'files');
const pathCopyDir = join(__dirname, 'files-copy');

async function delFiles () {
  const files = await readdir(pathCopyDir, {withFileTypes: true});
  for (const file of files) {
    await rm(join(pathCopyDir, file.name));
  }
}

async function copyFiles () {
  const files = await readdir(pathDir, {withFileTypes: true}).then(dirents => {
    return dirents.filter(dirent => dirent.isFile()); 
  });
  for (const file of files) {
    await copyFile(join(pathDir, file.name), join(pathCopyDir, file.name));
  }
}

(async () => {
  await mkdir(pathCopyDir, {recursive: true});
  await delFiles();
  await copyFiles();
})();

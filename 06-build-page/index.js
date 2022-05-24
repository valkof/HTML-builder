const { createReadStream, createWriteStream } = require('fs');
const { mkdir, readdir, readFile, writeFile, copyFile, rm } = require('fs/promises');
const { join, extname, parse } = require('path');


async function createDir(pathParrentDir, nameDir) {  
  const pathDir = await mkdir(join(pathParrentDir, nameDir), {recursive: true}).then(() => {
    return join(pathParrentDir, nameDir);
  });
  return pathDir;
}

async function createIndexFile(pathProjectDir, pathComponentsDir) {
  const pahtFileHtml = join(__dirname, 'template.html');
  const files = await readdir(pathComponentsDir, {withFileTypes: true}).then(dirents => {
    return dirents.filter(dirent => dirent.isFile() && extname(dirent.name) == '.html'); 
  });
  let bodyHtml = await readFile(pahtFileHtml).then(buffer => buffer.toString());
  for (const file of files) {
    const pathFile = join(pathComponentsDir, file.name);
    bodyHtml = await readFile(pathFile).then(buffer => {
      const regExp = new RegExp(`{{${parse(file.name).name}}}`);
      return bodyHtml.replace(regExp, buffer.toString());
    });
  }
  await writeFile(join(pathProjectDir, 'index.html'), bodyHtml);
}

async function createStyleFile(pathProjectDir, pathStylesDir) {
  const files = await readdir(pathStylesDir, {withFileTypes: true}).then(dirents => {
    return dirents.filter(dirent => dirent.isFile() && extname(dirent.name) == '.css'); 
  });
  const outputStream = createWriteStream(join(pathProjectDir, 'style.css'));
  for await (const file of files) {
    const inputFile = join(pathStylesDir, file.name);
    for await (const value of createReadStream(inputFile, 'utf-8')) {
      outputStream.write(value);
    }
    outputStream.write('\n\n');
  }
}

async function delDirectory(pathDelDir) {
  await rm(join(pathDelDir), {recursive: true, force:  true, maxRetries: 5});
}

async function copyFilesDirectory(pathInputDir, pathParrentDir) {
  const pathOutputDir =  await createDir(pathParrentDir, parse(pathInputDir).name);
  const dirents = await readdir(pathInputDir, {withFileTypes: true});
  for await (const dirent of dirents) {
    if (dirent.isFile()) {
      await copyFile(join(pathInputDir, dirent.name), join(pathOutputDir, dirent.name));
    } else {
      await copyFilesDirectory(join(pathInputDir, dirent.name), pathOutputDir);
    }
  }
}

(async () => {
  const pathProjectDir = await createDir(__dirname, 'project-dist');
  await createIndexFile(pathProjectDir, join(__dirname, 'components'));
  await createStyleFile(pathProjectDir, join(__dirname, 'styles'));
  const pathAssetsDir = await createDir(pathProjectDir, 'assets');
  await delDirectory(pathAssetsDir);
  await copyFilesDirectory(join(__dirname, 'assets'), pathProjectDir).then(() => {
    console.log('Done');
  });
})();
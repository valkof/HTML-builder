const { readdir, stat } = require('fs/promises');
const { join, extname, parse } = require('path');

const nameDir = 'secret-folder';
const pathDir = join(__dirname, nameDir);

async function getStatsFiles() {
  const files = await readdir(pathDir, {withFileTypes: true}).then(dirents => {
    console.log(`\n ${nameDir} files:`);
    return dirents.filter(dirent => dirent.isFile()); 
  });
  for (const file of files) {
    const pathFile = join(pathDir, file.name);
    await stat(pathFile).then(stat => {
      console.log(`${parse(pathFile).name} - ${extname(pathFile).slice(1)} - ${Number(stat.size / 1024).toFixed(3)}kb`);
    });
  }
}

(async () => {
  await getStatsFiles();
})();
const { readdir, stat } = require('fs/promises');
const path = require('path');

const nameDir = 'secret-folder';
const pathDir = path.join(__dirname, nameDir);

readdir(pathDir, { withFileTypes: true }).then(dirents => {
  console.log(`\n ${nameDir} files:`);
  dirents.forEach(dirent => {
    if (dirent.isFile()) {
      const file = path.parse(dirent.name);
      const pathFile = path.join(pathDir, dirent.name);
      stat(pathFile).then(stat => {
        console.log(`${file.name} - ${file.ext.slice(1)} - ${stat.size}b`);
      });
    }
  });
}).catch(err => console.log(err));
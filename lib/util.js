const fs = require('fs');
const path = require('path');

const dirExists = (currentDir, dirName) => {
  return fs.existsSync(path.join(currentDir, dirName));
}

module.exports = { dirExists };
const fs = require('fs');
const path = require('path');

const readTemplates = parentDir => {
  let templatesDir = path.join(parentDir, '..', 'templates');
  let subdirectories = fs.readdirSync(templatesDir).filter(v => fs.lstatSync(path.join(templatesDir,v)).isDirectory());
  let templates = subdirectories.map(dir => 
    Object.assign({}, JSON.parse(fs.readFileSync(path.join(templatesDir, dir, 'template-description.json'), 'utf8')), {value: dir})
  );
  return templates;
};



module.exports = { readTemplates };
const fs = require('fs');
const path = require('path');

const readTemplates = parentDir => {
  let templatesDir = path.join(parentDir, '..', 'templates');
  let subdirectories = fs.readdirSync(templatesDir).filter(v => fs.lstatSync(path.join(templatesDir,v)).isDirectory());
  let templates = subdirectories.map(dir => {
    let templateData = JSON.parse(fs.readFileSync(path.join(templatesDir, dir, 'template-description.json'), 'utf8'));
    templateData.value = dir;
    templateData.name = `${templateData.name}\n  [${templateData.modules.join(', ')}]`;
    return templateData;
  });
  return templates;
};

module.exports = { readTemplates };
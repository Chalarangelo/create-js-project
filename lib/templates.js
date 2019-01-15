const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');

const readTemplates = parentDir => {
  let templatesDir = path.join(parentDir, '..', 'templates');
  let subdirectories = fs.readdirSync(templatesDir).filter(v => fs.lstatSync(path.join(templatesDir,v)).isDirectory());
  let templates = subdirectories.map(dir => {
    let templateData = JSON.parse(fs.readFileSync(path.join(templatesDir, dir, 'template-description.json'), 'utf8'));
    templateData.value = dir;
    templateData.name = `${templateData.name}\n  [${[...templateData.dependencies, ...templateData.devDependencies].join(', ')}]`;
    return templateData;
  });
  return templates;
};

const buildFromTemplate = (parentDir, workingDir, selectedTemplate) => {
  let filesDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'files');
  let scriptsDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'scripts');
  childProcess.execSync(
    `npm i ${selectedTemplate.dependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' }
  );
  childProcess.execSync(
    `npm i --save-dev ${selectedTemplate.devDependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' }
  );
  fs.copySync(filesDir, workingDir);
  
}

module.exports = { readTemplates, buildFromTemplate };
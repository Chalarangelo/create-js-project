const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');

const readTemplates = (parentDir) => {
  const templatesDir = path.join(parentDir, '..', 'templates');
  const subdirectories = fs.readdirSync(templatesDir)
    .filter(v => fs.lstatSync(path.join(templatesDir, v)).isDirectory());
  const templates = subdirectories.map((dir) => {
    const templateData = JSON.parse(fs.readFileSync(path.join(templatesDir, dir, 'template.json'), 'utf8'));
    templateData.value = dir;
    return templateData;
  });
  return templates;
};

const buildPackageFromTemplate = (selectedTemplate) => {
  const packageData = {
    name: selectedTemplate.name,
    version: '1.0.0',
    description: 'A JavaScript project',
    main: selectedTemplate.main,
    scripts: selectedTemplate.scripts,
    repository: {
      type: 'git',
      url: '',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  };
  return JSON.stringify(packageData, null, 2);
};

const buildFromTemplate = (parentDir, workingDir, selectedTemplate) => {
  const filesDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'files');
  // const scriptsDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'scripts');
  const packageData = buildPackageFromTemplate(selectedTemplate);
  fs.writeFileSync(path.join(workingDir, 'package.json'), packageData);
  childProcess.execSync(
    `npm i ${selectedTemplate.dependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' },
  );
  childProcess.execSync(
    `npm i --save-dev ${selectedTemplate.devDependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' },
  );
  fs.copySync(filesDir, workingDir);
};

module.exports = { readTemplates, buildFromTemplate };

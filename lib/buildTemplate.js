const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const license = require('./license');
const gitignore = require('./gitignore');

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

const buildPackageFromTemplate = (selectedTemplate, projectName) => {
  const packageData = {
    name: projectName,
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

const buildReadmeFromTemplate = (projectName) => {
  const readmeData = `# ${projectName}\nA JavaScript project\n`;
  return readmeData;
};

const buildFromTemplate = (parentDir, workingDir, selectedTemplate, projectName) => {
  const filesDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'files');
  // const scriptsDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'scripts');
  const packageData = buildPackageFromTemplate(selectedTemplate, projectName);
  fs.writeFileSync(path.join(workingDir, 'package.json'), packageData);
  const readmeData = buildReadmeFromTemplate(selectedTemplate);
  if (!fs.existsSync(path.join(workingDir, 'README.md')))
    fs.writeFileSync(path.join(workingDir, 'README.md'), readmeData);
  if (!fs.existsSync(path.join(workingDir, 'LICENSE')))
    fs.writeFileSync(path.join(workingDir, 'LICENSE'), license);
  if (!fs.existsSync(path.join(workingDir, '.gitignore')))
    fs.writeFileSync(path.join(workingDir, '.gitignore'), gitignore);
  childProcess.execSync(
    `npm i ${selectedTemplate.dependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' }
  );
  childProcess.execSync(
    `npm i --save-dev ${selectedTemplate.devDependencies.join(' ')}`,
    { cwd: workingDir, stdio: 'inherit' }
  );
  fs.copySync(filesDir, workingDir);
  selectedTemplate.postInstall.forEach(cmd => {
    childProcess.execSync(cmd, { cwd: workingDir, stdio: 'inherit' });
  });
};

module.exports = { readTemplates, buildFromTemplate };

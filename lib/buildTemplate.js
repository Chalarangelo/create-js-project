const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');
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
  console.log(chalk.bold(`\n${process.platform !== 'win32' ? '🔨 ':''}Generating project files...\n`));
  console.log('\tGenerating package.json...');
  const packageData = buildPackageFromTemplate(selectedTemplate, projectName);
  fs.writeFileSync(path.join(workingDir, 'package.json'), packageData);

  console.log('\tGenerating README.md...');
  const readmeData = buildReadmeFromTemplate(projectName);
  if (!fs.existsSync(path.join(workingDir, 'README.md'))) 
    fs.writeFileSync(path.join(workingDir, 'README.md'), readmeData);

  console.log('\tGenerating LICENSE...');
  if (!fs.existsSync(path.join(workingDir, 'LICENSE'))) 
    fs.writeFileSync(path.join(workingDir, 'LICENSE'), license);

  console.log('\tGenerating .gitignore...');
  if (!fs.existsSync(path.join(workingDir, '.gitignore'))) 
    fs.writeFileSync(path.join(workingDir, '.gitignore'), gitignore);

  
  console.log('\tGenerating .npmignore...');
  if(selectedTemplate.npmignore && selectedTemplate.npmignore.length)
    fs.writeFileSync(path.join(workingDir, '.npmignore'), selectedTemplate.npmignore.join('\n'));
  else
    fs.writeFileSync(path.join(workingDir, '.npmignore'), '');

  if (selectedTemplate.eslintrc) {
    console.log('\tGenerating .eslintrc.json...');
    fs.writeFileSync(path.join(workingDir, '.eslintrc.json'), JSON.stringify(selectedTemplate.eslintrc, null, 2));
  }

  if (selectedTemplate.eslintignore && selectedTemplate.eslintignore.length) {
    console.log('\tGenerating .eslintignore...');
    fs.writeFileSync(path.join(workingDir, '.eslintignore'), selectedTemplate.eslintignore.join('\n'));
  }

  if (selectedTemplate.dependencies && selectedTemplate.dependencies.length) {
    console.log(chalk.bold(`\n${process.platform !== 'win32' ? '🚚 ':''}Installing dependencies...\n`));
    childProcess.execSync(
      `npm i ${selectedTemplate.dependencies.join(' ')}`,
      { cwd: workingDir, stdio: 'inherit' },
    );
  }

  if (selectedTemplate.devDependencies && selectedTemplate.devDependencies.length) {
    console.log(chalk.bold(`\n${process.platform !== 'win32' ? '🚧 ':''}Installing devDependencies...\n`));
    childProcess.execSync(
      `npm i --save-dev ${selectedTemplate.devDependencies.join(' ')}`,
      { cwd: workingDir, stdio: 'inherit' },
    );
  }

  console.log(chalk.bold(`\n${process.platform !== 'win32' ? '📦 ':''}Copying template files...\n`));
  const filesDir = path.join(parentDir, '..', 'templates', selectedTemplate.value, 'files');
  fs.copySync(filesDir, workingDir);

  if (selectedTemplate.postInstall && selectedTemplate.postInstall.length) {
    console.log(chalk.bold(`\n${process.platform !== 'win32' ? '🔧 ':''}Running post-installation commands...\n`));
    selectedTemplate.postInstall.forEach((cmd) => {
      childProcess.execSync(cmd, { cwd: workingDir, stdio: 'inherit' });
    });
  }
};

module.exports = { readTemplates, buildFromTemplate };

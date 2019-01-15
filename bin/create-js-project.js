#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const { readTemplates } = require('../lib/templates.js');
const { group } = require('../lib/util.js');
const { buildPackage } = require('../lib/buildPackage');

const argv = require('minimist')(process.argv.slice(2));
const templatesData = readTemplates(__dirname);
const templates = {
  values: group(templatesData, v => v.category).reduce((acc, v) => [...acc, new inquirer.Separator(), ...v])
};
templates.default = templates.values.indexOf('JavaScript');

const questionOptions = {
  params: argv,
  currentDir: process.cwd(),
  templates: templates
}

const questions = require('../lib/questions')(questionOptions);

inquirer.prompt(questions).then(answers => {
  console.log(JSON.stringify(answers, null, 2));

  if (answers.overwriteDir !== undefined && !answers.overwriteDir) {
    console.log('Please try again with a different name!');
    process.exit(0);
  }
  if (answers.overwriteDir === undefined) 
    fs.mkdirSync(`${answers.projectName}`);
  
    process.chdir(`./${answers.projectName}`);

  fs.writeFileSync('package.json', buildPackage(answers));
});
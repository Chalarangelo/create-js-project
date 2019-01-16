#!/usr/bin/env node

const fs = require('fs-extra');
const inquirer = require('inquirer');
const argv = require('minimist')(process.argv.slice(2));
const { readTemplates, buildFromTemplate } = require('../lib/buildTemplate.js');
const { group } = require('../lib/util.js');


const templatesData = readTemplates(__dirname);
const templates = {
  values: group(templatesData, v => v.category)
    .reduce((acc, v) => [...acc, new inquirer.Separator(), ...v]),
};
templates.default = templates.values.findIndex(v => v.default);

const questionOptions = {
  params: argv,
  currentDir: process.cwd(),
  templates,
};

const questions = require('../lib/questions')(questionOptions);

inquirer.prompt(questions).then((answers) => {
  if (answers.overwriteDir !== undefined && !answers.overwriteDir) {
    console.log('Please try again with a different name!');
    process.exit(0);
  }
  if (answers.overwriteDir === undefined) { fs.mkdirSync(`${answers.projectName}`); }

  process.chdir(`./${answers.projectName}`);

  const selectedTemplate = templates.values.find(v => v.value === answers.projectTemplate);
  buildFromTemplate(__dirname, process.cwd(), selectedTemplate);
});

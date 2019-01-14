#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const argv = require('minimist')(process.argv.slice(2));
const packageQuestions = require('../lib/questions/packageQuestions')(argv, process.cwd());
const buildPackage = require('../lib/scripts/buildPackage');

inquirer.prompt([...packageQuestions]).then(answers => {
  if (answers.overwriteDir !== undefined && !answers.overwriteDir) {
    console.log('Please try again with a different name!');
    process.exit(0);
  }

  if (answers.overwriteDir === undefined) fs.mkdirSync(`${answers.packageName}`);
  process.chdir(`./${answers.packageName}`);

  fs.writeFileSync('package.json', buildPackage(answers));
});
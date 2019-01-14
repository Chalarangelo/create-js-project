const { dirExists } = require('../util');

let questions = (params, currentDir) => [
  {
    type: 'input',
    name: 'packageName',
    message: 'Specify a package name:',
    default (answers) {
      return (params._ && params._.length) ? params._[0] : '';
    },
    validate (input) {
      return !!input.trim().length ? true : 'Sorry, package name cannot be empty!';
    },
  },
  {
    type: 'confirm',
    name: 'overwriteDir',
    message: 'The specified directory already exists, do you want to overwrite it?',
    default: true,
    when(answers) {
      return dirExists(currentDir, answers.packageName);
    }
  },
  {
    type: 'input',
    name: 'packageDescription',
    message: 'Specify a package description:',
    when (answers) {
      return answers.overwriteDir === undefined || answers.overwriteDir;
    }
  },
  {
    type: 'input',
    name: 'packageVersion',
    message: 'Specify a package version:',
    default: '1.0.0',
    validate (input) {
      return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/.test(input);
    },
    when (answers) {
      return answers.overwriteDir === undefined || answers.overwriteDir;
    }
  },
  {
    type: 'input',
    name: 'packageEntryPoint',
    message: 'Specify an entry point:',
    default: 'index.js',
    when (answers) {
      return answers.overwriteDir === undefined || answers.overwriteDir;
    }
  },
  {
    type: 'list',
    name: 'packageLicense',
    message: 'Specify a license:',
    choices: ['MIT', 'ISC', 'GPL-3.0-or-later', 'LGPL-3.0-or-later', 'BSD-3-Clause'],
    default: 0,
    when (answers) {
      return answers.overwriteDir === undefined || answers.overwriteDir;
    }
  },
];

module.exports = questions;
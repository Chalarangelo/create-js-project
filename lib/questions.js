const { dirExists } = require('./util');

let questions = ({ params, templates, currentDir }) => [
  {
    type: 'input',
    name: 'projectName',
    message: 'Specify a package name:',
    default(answers) {
      return (params._ && params._.length) ? params._[0] : '';
    },
    validate(input) {
      return !!input.trim().length ? true : 'Sorry, package name cannot be empty!';
    },
  },
  {
    type: 'confirm',
    name: 'overwriteDir',
    message: 'The specified directory already exists, do you want to overwrite it?',
    default: true,
    when(answers) {
      return dirExists(currentDir, answers.projectName);
    }
  },
  {
    type: 'list',
    name: 'projectTemplate',
    message: 'Specify a license:',
    choices: templates.values,
    default: templates.default,
    when(answers) {
      return answers.overwriteDir === undefined || answers.overwriteDir;
    }
  },
];

module.exports = questions;
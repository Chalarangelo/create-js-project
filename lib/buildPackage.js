const buildPackage = (answers) => {
  let packageData = {
    'name': answers.projectName,
    'version': '1.0.0',
    'main': 'index.js',
    'scripts': {
      'start': 'node ./index.js'
    },
    'repository': {
      'type': 'git',
      'url': ''
    },
    'keywords': [],
    'author': '',
    'license': 'MIT',
    'homepage': ''
  };
  return JSON.stringify(packageData, null, 2);
}

module.exports = { buildPackage };
const buildPackage = (answers) => {
  let packageData = {
    "name": answers.packageName,
    "version": answers.packageVersion,
    "main": answers.packageEntryPoint,
    "scripts": {
      "start": `node ./${answers.packageEntryPoint}`
    },
    "license": answers.packageLicense
  };
  return JSON.stringify(packageData, null, 2);
}

module.exports = buildPackage;
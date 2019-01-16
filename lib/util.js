const fs = require('fs-extra');
const path = require('path');

const groupBy = (arr, fn) => arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
  acc[val] = (acc[val] || []).concat(arr[i]);
  return acc;
}, {});

const objectToArrays = obj => Object.keys(obj).reduce((acc, v) => [...acc, obj[v]], []);

const composeRight = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

const group = composeRight(groupBy, objectToArrays);

const dirExists = (currentDir, dirName) => fs.existsSync(path.join(currentDir, dirName));

module.exports = { group, dirExists };

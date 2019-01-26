const fs = require('fs');
const path = require('path');
const { readTemplates } = require('../lib/buildTemplate.js');

const templatesData = readTemplates(__dirname);

let index = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const includedTemplates = templatesData.map(
  v => `<li><a href="https://github.com/Chalarangelo/create-js-project/tree/master/templates/${v.value}" target="_blank" rel="noopener noreferrer">${v.name}</a> - ${v['meta:description']}</li>`
).join('\n');

fs.writeFileSync(path.join(__dirname, '..', 'docs', 'index.html'), index.replace(/\$included_templates/g, includedTemplates));
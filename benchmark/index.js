const { readdirSync } = require('node:fs');
const { join } = require('node:path');

let files = readdirSync(__dirname);
files = files.filter(
  (file) => file.endsWith('.js') && !file.startsWith('_') && file !== 'index.js'
);

console.log(`Found ${files.length} benchmarks`);

for (const file of files) require(join(__dirname, file));

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const inputFile = path.resolve('src/common/i18-n/en.json');
const outputFile = path.resolve('src/genfiles/i18-n/messages.ts');
const code = [];

code.push('import {MessageId} from \'../../common/i18-n/MessageId\';');
code.push('');
code.push('export const M = {');

const json = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

for (const key in json) {
  if (json.hasOwnProperty(key)) {
    code.push(`  /** ${json[key]} */`);
    code.push(`  ${key}: new MessageId('${key}'),`);
  }
}

code.push('} as const;');
code.push('');

if (!fs.existsSync('src/genfiles/i18-n')) {
  fs.mkdirSync('src/genfiles/i18-n');
}

fs.writeFileSync(outputFile, code.join('\n'));

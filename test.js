const fs = require('fs');
const content = fs.readFileSync('app/tools/facebook-collector/page.js', 'utf8');
const rawScriptStr = content.split('const rawScript = `')[1].split('`;')[0];
const script = rawScriptStr.replace(/\s+/g, ' ').trim();
fs.writeFileSync('output.txt', script);

try {
  new Function(script);
  console.log('Syntax OK');
} catch (e) {
  console.error('Syntax Error:', e.message);
}

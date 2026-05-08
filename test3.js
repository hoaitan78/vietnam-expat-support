const fs = require('fs');
const content = fs.readFileSync('app/tools/facebook-collector/page.js', 'utf8');
const rawScriptStr = content.split('const rawScript = `')[1].split('`;')[0];
// We need to un-escape the \${...} back to ${...} for the Function constructor if we evaluate it directly,
// but let's just see if there's any obvious syntax error.
const script = rawScriptStr.replace(/\\\$/g, '$').replace(/\s+/g, ' ').trim();

try {
  new Function(script);
  console.log('Syntax OK');
} catch (e) {
  console.error('Syntax Error:', e.message);
}

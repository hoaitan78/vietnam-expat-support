const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        process.env[match[1]] = match[2].trim().replace(/^"(.*)"$/, '$1');
    }
});
import('./services/aiAgent.js').then(m => m.generateExpatFacebookPost(1).then(console.log)).catch(console.error);

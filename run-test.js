import fs from 'fs';
import { getApprovedPostForToday } from './services/googleSheets.js';

const env = fs.readFileSync('.env.local', 'utf8').split('\n');
for (const line of env) {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    process.env[k] = v;
  }
}

async function test() {
  try {
    console.log('Testing Google Sheets...');
    const post = await getApprovedPostForToday();
    if (post) {
      console.log('Found post:', post.content.substring(0, 50) + '...', 'Image:', post.imageUrl);
      console.log('Row status:', post.row.get('Trạng thái'));
    } else {
      console.log('No approved post found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

test();

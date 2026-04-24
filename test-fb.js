import fs from 'fs';
import axios from 'axios';

const env = fs.readFileSync('.env.local', 'utf8').split('\n');
for (const line of env) {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    process.env[k] = v;
  }
}

async function checkFacebookToken() {
  try {
    const pageId = process.env.AI_AGENT_FACEBOOK_PAGE_ID;
    const pageAccessToken = process.env.AI_AGENT_FACEBOOK_ACCESS_TOKEN;

    if (!pageId || !pageAccessToken) {
      console.log('Missing Facebook Token or Page ID');
      return;
    }

    const url = `https://graph.facebook.com/v19.0/${pageId}?access_token=${pageAccessToken}`;
    console.log(`Testing token against page ${pageId}...`);
    const response = await axios.get(url);
    console.log('Token is valid. Page name:', response.data.name);
  } catch (error) {
    console.error('Facebook Token Error:', error.response?.data || error.message);
  }
}

checkFacebookToken();

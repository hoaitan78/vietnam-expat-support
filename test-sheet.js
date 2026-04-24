
import { getApprovedPostForToday } from './services/googleSheets.js';

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

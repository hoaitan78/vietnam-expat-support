require('dotenv').config({ path: '.env.local' });
const { generateExpatFacebookPost } = require('./services/aiAgent.js');
const { addGeneratedPostsToSheet } = require('./services/googleSheets.js');

async function main() {
  try {
    console.log('🤖 AI Agent đang nghĩ ý tưởng cho 7 ngày tới...');
    const aiPosts = await generateExpatFacebookPost(7);

    const today = new Date();
    const formattedPosts = aiPosts.map((post, index) => {
        const postDate = new Date(today);
        postDate.setDate(today.getDate() + index);
        const time = 'Chiều (17:00)';
        
        return {
            ...post,
            date: postDate.toLocaleDateString('vi-VN'),
            time: time
        };
    });

    console.log('📝 Đang chèn 7 bài viết vào Google Sheets...');
    const result = await addGeneratedPostsToSheet(formattedPosts);

    if (result.success) {
      console.log('✅ Đã tạo và thêm 7 bài viết vào Google Sheets thành công!');
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi hệ thống:', error);
  }
}

main();

// File: services/facebook.js
import axios from 'axios';

export async function publishPostToFacebook(message, imageUrl = null, videoUrl = null) {
  try {
    const pageId = process.env.AI_AGENT_FACEBOOK_PAGE_ID;
    const pageAccessToken = process.env.AI_AGENT_FACEBOOK_ACCESS_TOKEN;

    if (!pageId || !pageAccessToken) {
      throw new Error('Thiếu thông tin Facebook Token trong file .env.local');
    }

    let url;
    let payload = { access_token: pageAccessToken };

    if (videoUrl) {
        console.log('🎥 Phát hiện có Video, đang tải lên Facebook...');
        url = `https://graph.facebook.com/v19.0/${pageId}/videos`;
        payload.file_url = videoUrl;
        payload.description = message;
    } else if (imageUrl) {
        console.log('🖼️ Phát hiện có hình ảnh, đang tải lên Facebook...');
        url = `https://graph.facebook.com/v19.0/${pageId}/photos`;
        payload.url = imageUrl;
        payload.message = message;
    } else {
        console.log('📄 Không dùng ảnh/video, tiến hành đăng bài viết chữ thường...');
        url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
        payload.message = message;
    }

    const response = await axios.post(url, payload);

    console.log('✅ Đăng bài lên Facebook thành công!', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Lỗi khi đăng bài lên Facebook:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

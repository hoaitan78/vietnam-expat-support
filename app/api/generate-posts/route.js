import { NextResponse } from 'next/server';
import { generateExpatFacebookPost } from '../../../services/aiAgent';
import { addGeneratedPostsToSheet } from '../../../services/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // 1. Tạo 7 bài viết nháp (cho 7 ngày tới, mỗi ngày 1 bài)
    console.log('🤖 AI Agent đang nghĩ ý tưởng...');
    const aiPosts = await generateExpatFacebookPost(7);

    // 2. Định hình lại ngày và giờ cho các bài viết
    const today = new Date();
    const formattedPosts = aiPosts.map((post, index) => {
        const postDate = new Date(today);
        postDate.setDate(today.getDate() + index); // Mỗi bài là 1 ngày, bắt đầu từ hôm nay
        const time = 'Chiều (17:00)';
        
        return {
            ...post,
            date: postDate.toLocaleDateString('vi-VN'),
            time: time
        };
    });

    // 3. Ghi vào Google Sheets
    console.log('📝 Đang chèn vào bảng tính Google Sheets...');
    const result = await addGeneratedPostsToSheet(formattedPosts);

    if (!result.success) throw new Error(result.error);

    return NextResponse.json({
      success: true,
      message: 'Đã tạo và đẩy 10 bài viết dự thảo vào Google Sheets thành công! Vui lòng vào Sheet để kiểm duyệt.',
      data: formattedPosts
    });

  } catch (error) {
    console.error('❌ Lỗi API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

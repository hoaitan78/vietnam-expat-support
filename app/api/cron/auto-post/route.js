import { NextResponse } from 'next/server';
import { getApprovedPostForToday, markPostAsPublished } from '../../../services/googleSheets';
import { publishPostToFacebook } from '../../../services/facebook';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'vietnam-expat-secret-token';
    
    if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production') {
       console.warn('Unauthorized access to cron endpoint');
       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Kiểm tra Google Sheets xem có bài nào đã được duyệt ('OK') chờ đăng không
    console.log('👀 Đang kiểm tra Google Sheets tìm bài được duyệt...');
    const approvedPost = await getApprovedPostForToday();

    if (!approvedPost) {
        console.log('ℹ️ Không có bài viết nào được đánh dấu OK chờ đăng hôm nay.');
        return NextResponse.json({ success: true, message: 'Không có bài đăng nào cần xử lý.' });
    }

    const { row, content, imageUrl } = approvedPost;

    // 2. Gửi bài viết sang Facebook
    console.log('📤 Tìm thấy bài viết! Đang đăng lên Facebook Page...');
    const fbResult = await publishPostToFacebook(content, imageUrl);

    if (!fbResult.success) {
      throw new Error(JSON.stringify(fbResult.error));
    }

    // 3. Đánh dấu trên Sheet là Đã đăng thành công
    await markPostAsPublished(row);

    return NextResponse.json({
      success: true,
      message: 'Đã tự động đăng bài được duyệt xếp lịch lên Facebook!',
      post_id: fbResult.data.id
    });

  } catch (error) {
    console.error('❌ Lỗi hệ thống auto-post:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

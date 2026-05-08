import { NextResponse } from 'next/server';
import { addCollectedPost } from '../../../services/googleSheets';

// Cho phép CORS từ Facebook
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Hoặc có thể giới hạn 'https://www.facebook.com' nếu muốn bảo mật hơn
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Xử lý Preflight request (OPTIONS) cho CORS
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, content, url } = body;

        if (!type || !content || !url) {
            return NextResponse.json(
                { success: false, error: 'Thiếu dữ liệu bắt buộc (type, content, url)' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (type !== 'khach' && type !== 'nha') {
            return NextResponse.json(
                { success: false, error: 'Loại bài viết không hợp lệ (chỉ chấp nhận "khach" hoặc "nha")' },
                { status: 400, headers: corsHeaders }
            );
        }

        console.log(`[API] Đang lưu bài viết phân loại: ${type}`);
        
        const result = await addCollectedPost(type, content, url);

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Đã lưu bài viết thành công' }, { headers: corsHeaders });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500, headers: corsHeaders });
        }

    } catch (error) {
        console.error('[API] Lỗi server:', error);
        return NextResponse.json({ success: false, error: 'Lỗi máy chủ nội bộ' }, { status: 500, headers: corsHeaders });
    }
}

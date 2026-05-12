import { NextResponse } from 'next/server';
import { addCollectedPost } from '../../../services/googleSheets';

export async function POST(req) {
    try {
        // Handle form data
        const formData = await req.formData();
        const type = formData.get('type');
        const content = formData.get('content');
        const url = formData.get('url');
        const images = formData.get('images');

        if (!type || !content || !url) {
            return new NextResponse(`
                <html><body>
                    <h2 style="color: red;">Lỗi: Thiếu dữ liệu bắt buộc!</h2>
                    <p>Vui lòng thử lại.</p>
                </body></html>
            `, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        if (type !== 'khach' && type !== 'nha') {
            return new NextResponse(`
                <html><body>
                    <h2 style="color: red;">Lỗi: Loại bài viết không hợp lệ!</h2>
                </body></html>
            `, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        console.log(`[API Form] Đang lưu bài viết phân loại: ${type}`);
        
        const result = await addCollectedPost(type, content, url, images);

        if (result.success) {
            return new NextResponse(`
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Đã lưu bài viết</title>
                </head>
                <body style="font-family: sans-serif; text-align: center; padding: 40px;">
                    <h2 style="color: green;">✅ Đã lưu bài viết thành công!</h2>
                    <p>Dữ liệu đã được thêm vào Google Sheets.</p>
                    <p style="color: #666; font-size: 14px;">Cửa sổ này sẽ tự động đóng...</p>
                    <script>
                        setTimeout(() => {
                            window.close();
                        }, 1500);
                    </script>
                </body>
                </html>
            `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        } else {
            return new NextResponse(`
                <html><body>
                    <h2 style="color: red;">❌ Lỗi khi lưu: ${result.error}</h2>
                </body></html>
            `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

    } catch (error) {
        console.error('[API Form] Lỗi server:', error);
        return new NextResponse(`
            <html><body>
                <h2 style="color: red;">❌ Lỗi máy chủ nội bộ</h2>
                <p>${error.message}</p>
            </body></html>
        `, { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
}

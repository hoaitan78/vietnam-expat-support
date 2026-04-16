// File: services/googleSheets.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Khởi tạo Auth Client
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Xử lý các ký tự xuống dòng trong key
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getDoc = async () => {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    return doc;
}

export async function addGeneratedPostsToSheet(posts) {
    try {
        const doc = await getDoc();
        const sheet = doc.sheetsByIndex[0]; // Lấy sheet đầu tiên

        // Thêm tiêu đề cột nếu sheet chống
        await sheet.setHeaderRow(['Chủ đề', 'Nội dung bài viết', 'Ảnh minh họa', 'Ngày đăng', 'Duyệt bài', 'Trạng thái']);

        const rowsToAdd = posts.map(post => ({
            'Chủ đề': post.topic,
            'Nội dung bài viết': post.content,
            'Ảnh minh họa': post.imageUrl || '',
            'Ngày đăng': post.date,
            'Duyệt bài': '', // Cột duyệt để chống
            'Trạng thái': 'Đang chờ'
        }));

        await sheet.addRows(rowsToAdd);
        console.log(`✅ Đã chèn ${posts.length} bài viết dự thảo kèm ảnh vào Google Sheets.`);
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi khi ghi vào Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

export async function getApprovedPostForToday() {
  try {
      const doc = await getDoc();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();

      // Mặc định lấy bài viết đầu tiên được đánh dấu "OK" (hoặc "X") ở cột Duyệt bài 
      // VÀ có trạng thái không phải "Đã đăng thành công"
      const approvedRowInfo = rows.find(row => {
          const isApproved = row.get('Duyệt bài')?.trim().toUpperCase() === 'OK' || row.get('Duyệt bài')?.trim().toUpperCase() === 'X';
          const isNotPublished = row.get('Trạng thái') !== 'Đã đăng thành công';
          return isApproved && isNotPublished;
      });

      if (!approvedRowInfo) return null;

      return {
          row: approvedRowInfo,
          content: approvedRowInfo.get('Nội dung bài viết'),
          imageUrl: approvedRowInfo.get('Ảnh minh họa')
      };
      
  } catch (error) {
      console.error('❌ Lỗi khi đọc dữ liệu từ Google Sheets:', error);
      throw error;
  }
}

export async function markPostAsPublished(row) {
    try {
        row.set('Trạng thái', 'Đã đăng thành công');
        await row.save();
        console.log('✅ Đã cập nhật Trạng thái thành công trên Google Sheets');
    } catch (error) {
         console.error('❌ Lỗi khi cập nhật Trạng thái trên Google Sheets:', error);
    }
}

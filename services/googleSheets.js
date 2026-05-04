// File: services/googleSheets.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Khởi tạo Auth Client
const privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: privateKey.replace(/\\n/g, '\n'), // Xử lý các ký tự xuống dòng trong key
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

        // Thêm tiêu đề cột nếu sheet trống
        await sheet.setHeaderRow(['Chủ đề', 'Nội dung bài viết', 'Ảnh minh họa', 'Video', 'Ngày đăng', 'Giờ đăng', 'Duyệt bài', 'Trạng thái', 'Xem trước ảnh']);

        const rowsToAdd = posts.map(post => ({
            'Chủ đề': post.topic,
            'Nội dung bài viết': post.content,
            'Ảnh minh họa': post.imageUrl || '',
            'Video': post.videoUrl || '',
            'Ngày đăng': post.date,
            'Giờ đăng': post.time || 'Sáng (8:00)',
            'Duyệt bài': '', // Cột duyệt để trống
            'Trạng thái': 'Đang chờ',
            'Xem trước ảnh': post.imageUrl ? `=IMAGE("${post.imageUrl}")` : ''
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

      // Lấy thời gian hiện tại ở Việt Nam (ICT)
      const now = new Date();
      const ictTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
      const currentDay = ictTime.getDate();
      const currentMonth = ictTime.getMonth() + 1;
      const currentYear = ictTime.getFullYear();
      const currentHour = ictTime.getHours();

      // Lọc bài viết được đánh dấu "OK" (hoặc "X") ở cột Duyệt bài,
      // VÀ có trạng thái không phải "Đã đăng thành công",
      // VÀ thời gian lên lịch (Ngày + Giờ) nhỏ hơn hoặc bằng thời gian hiện tại
      const approvedRowInfo = rows.find(row => {
          const isApproved = row.get('Duyệt bài')?.trim().toUpperCase() === 'OK' || row.get('Duyệt bài')?.trim().toUpperCase() === 'X';
          const isNotPublished = row.get('Trạng thái') !== 'Đã đăng thành công';
          
          if (!isApproved || !isNotPublished) return false;

          const postDateStr = row.get('Ngày đăng')?.trim();
          const postTimeStr = row.get('Giờ đăng')?.trim();

          if (postDateStr) {
             const parts = postDateStr.split('/');
             if (parts.length === 3) {
                 const d = parseInt(parts[0], 10);
                 const m = parseInt(parts[1], 10);
                 const y = parseInt(parts[2], 10);
                 
                 let hour = 8; // Mặc định Sáng là 8h
                 if (postTimeStr && postTimeStr.toLowerCase().includes('chiều')) {
                     hour = 17; // Chiều là 17h
                 }
                 
                 const postDateNum = y * 10000 + m * 100 + d;
                 const currentDateNum = currentYear * 10000 + currentMonth * 100 + currentDay;
                 
                 // NẾU BÀI ĐÃ QUA NGÀY => BỎ QUA (Không đăng bù nữa theo yêu cầu của bạn)
                 if (postDateNum < currentDateNum) {
                     return false;
                 }
                 
                 // NẾU BÀI CỦA HÔM NAY => KIỂM TRA GIỜ
                 if (postDateNum === currentDateNum) {
                     // Trừ hao 1 tiếng (hour - 1) để phòng trường hợp Vercel Cron chạy sớm vài giây 
                     // (ví dụ: 16h59 thay vì 17h00)
                     if (currentHour >= hour - 1) {
                         return true;
                     }
                 }
             }
          }

          return false;
      });

      if (!approvedRowInfo) {
          console.log(`ℹ️ Không có bài viết nào được duyệt chờ đăng cho đến thời điểm hiện tại (${currentDay}/${currentMonth}/${currentYear} ${currentHour}h).`);
          return null;
      }

      return {
          row: approvedRowInfo,
          content: approvedRowInfo.get('Nội dung bài viết'),
          imageUrl: approvedRowInfo.get('Ảnh minh họa'),
          videoUrl: approvedRowInfo.get('Video')
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

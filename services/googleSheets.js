// File: services/googleSheets.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { classifyLocation } from './aiMatcher.js';

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
      const currentDateNum = currentYear * 10000 + currentMonth * 100 + currentDay;

      // Xóa các bài viết đã qua ngày (Tối đa 5 bài mỗi lần chạy để tránh quá tải)
      let deletedCount = 0;
      const rowsToDelete = [];
      for (const row of rows) {
          const postDateStr = row.get('Ngày đăng')?.trim();
          if (postDateStr) {
             const parts = postDateStr.split('/');
             if (parts.length === 3) {
                 const postDateNum = parseInt(parts[2], 10) * 10000 + parseInt(parts[1], 10) * 100 + parseInt(parts[0], 10);
                 if (postDateNum < currentDateNum) {
                     rowsToDelete.push(row);
                 }
             }
          }
      }

      for (const row of rowsToDelete) {
          if (deletedCount >= 5) break; // Giới hạn xóa 5 bài mỗi lần
          try {
              await row.delete();
              deletedCount++;
          } catch (e) {
              console.error('Lỗi khi xóa bài cũ:', e);
          }
      }
      if (deletedCount > 0) {
          console.log(`✅ Đã tự động xóa ${deletedCount} bài viết cũ khỏi Google Sheets.`);
          // Cập nhật lại danh sách dòng sau khi xóa để tránh lỗi index
          await sheet.loadCells(); 
      }

      // Lọc bài viết được đánh dấu "OK" (hoặc "X") ở cột Duyệt bài,
      // VÀ có trạng thái không phải "Đã đăng thành công",
      // VÀ thời gian lên lịch (Ngày + Giờ) khớp với hiện tại
      const currentRows = await sheet.getRows(); // Lấy lại danh sách sau khi xóa
      const approvedRowInfo = currentRows.find(row => {
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

// --- TÍNH NĂNG AI AGENT GHÉP NỐI THUÊ NHÀ ---

async function getOrCreateSheet(doc, title, headers) {
    let sheet = doc.sheetsByTitle[title];
    if (!sheet) {
        console.log(`Đang tạo tab mới: ${title}...`);
        sheet = await doc.addSheet({ title, headerValues: headers });
    } else {
        await sheet.loadHeaderRow(); // Lấy headers hiện tại
        
        let needsUpdate = false;
        if (sheet.headerValues.length !== headers.length) {
            needsUpdate = true;
        } else {
            for (let i = 0; i < headers.length; i++) {
                if (sheet.headerValues[i] !== headers[i]) {
                    needsUpdate = true;
                    break;
                }
            }
        }
        
        if (needsUpdate) {
            console.log(`Cập nhật headers cho tab: ${title}...`);
            await sheet.setHeaderRow(headers); // Cập nhật trên cloud
            await sheet.loadHeaderRow(); // RẤT QUAN TRỌNG: Cập nhật lại vào bộ nhớ để addRows không bị lỗi cột
        }
    }
    return sheet;
}

export async function getRenters() {
    try {
        const doc = await getDoc();
        const headers = ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Ngân sách', 'Số phòng', 'Yêu cầu khác', 'Tên Khách', 'Mã Khách', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý'];
        const sheet = await getOrCreateSheet(doc, 'KhachCanThue', headers);
        
        const rows = await sheet.getRows();
        // Chỉ lấy những khách chưa được AI xử lý hoặc xử lý rồi để mang đi so sánh
        // Tạm thời lấy tất cả để ghép nối
        return rows;
    } catch (error) {
        console.error('❌ Lỗi khi đọc sheet KhachCanThue:', error);
        return [];
    }
}

export async function updateRenterAIInfo(row, aiData) {
    row.set('Đã xử lý AI', 'YES');
    row.set('Khu vực', aiData.location || '');
    row.set('Ngân sách', aiData.budget || '');
    row.set('Số phòng', aiData.bedrooms || '');
    row.set('Yêu cầu khác', aiData.other_requirements || '');
    row.set('Tên Khách', aiData.name || 'Chưa rõ');
    row.set('Số điện thoại', aiData.phone || '');
    row.set('Vị trí địa lý', classifyLocation(aiData.location));
    if (!row.get('Mã Khách')) {
        row.set('Mã Khách', 'KH' + Math.floor(10000 + Math.random() * 90000));
    }
    await row.save();
}

export async function getListings() {
    try {
        const doc = await getDoc();
        const headers = ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Giá thuê', 'Số phòng', 'Tiện ích', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý'];
        const sheet = await getOrCreateSheet(doc, 'NhaDangTrong', headers);
        
        const rows = await sheet.getRows();
        return rows;
    } catch (error) {
        console.error('❌ Lỗi khi đọc sheet NhaDangTrong:', error);
        return [];
    }
}

export async function updateListingAIInfo(row, aiData) {
    row.set('Đã xử lý AI', 'YES');
    row.set('Khu vực', aiData.location || '');
    row.set('Giá thuê', aiData.price || '');
    row.set('Số phòng', aiData.bedrooms || '');
    row.set('Tiện ích', aiData.amenities || '');
    row.set('Số điện thoại', aiData.phone || '');
    row.set('Vị trí địa lý', classifyLocation(aiData.location));
    await row.save();
}

export async function saveMatchResults(matches) {
    try {
        const doc = await getDoc();
        const headers = [
            'NGÀY GHÉP NỐI', 'MÃ KHÁCH THUÊ', 'LINK KHÁCH TÌM NHÀ', 'THÔNG TIN KHÁCH TÌM NHÀ', 
            'SỐ ĐIỆN THOẠI KHÁCH TÌM NHÀ', 'LINK NHÀ CHO THUÊ', 'THÔNG TIN NHÀ CHO THUÊ', 
            'SỐ ĐIỆN THOẠI NHÀ CHO THUÊ', 'KẾT QUẢ SO SÁNH', 'HÌNH ẢNH NHÀ CHO THUÊ', 'VỊ TRÍ ĐỊA LÝ'
        ];
        const sheet = await getOrCreateSheet(doc, 'KetQuaGhepNoi', headers);
        
        const rowsToAdd = matches.map(match => {
            let imageContent = '';
            if (match.listingImages) {
                const urls = match.listingImages.split('\\n').filter(u => u.trim() !== '');
                if (urls.length > 0) {
                    imageContent = `=IMAGE("${urls[0].trim()}")`;
                }
            }

            return {
                'NGÀY GHÉP NỐI': new Date().toLocaleDateString('vi-VN'),
                'MÃ KHÁCH THUÊ': match.renterId || '',
                'LINK KHÁCH TÌM NHÀ': match.renterLink || '',
                'THÔNG TIN KHÁCH TÌM NHÀ': match.renterRawInfo || '',
                'SỐ ĐIỆN THOẠI KHÁCH TÌM NHÀ': match.renterPhone || '',
                'LINK NHÀ CHO THUÊ': match.listingLink || '',
                'THÔNG TIN NHÀ CHO THUÊ': match.listingRawInfo || '',
                'SỐ ĐIỆN THOẠI NHÀ CHO THUÊ': match.listingPhone || '',
                'KẾT QUẢ SO SÁNH': match.scoreAndReason || '',
                'HÌNH ẢNH NHÀ CHO THUÊ': imageContent,
                'VỊ TRÍ ĐỊA LÝ': match.locationCategory || 'Unknown'
            };
        });

        if (rowsToAdd.length > 0) {
            const addedRows = await sheet.addRows(rowsToAdd);
            
            // Tự động căn chỉnh xuống dòng (Wrap Text) cho các dòng vừa thêm
            try {
                const startRow = addedRows[0].rowNumber - 1;
                const endRow = addedRows[addedRows.length - 1].rowNumber;
                await sheet.loadCells({
                    startRowIndex: startRow,
                    endRowIndex: endRow,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length
                });
                
                for (let r = startRow; r < endRow; r++) {
                    for (let c = 0; c < headers.length; c++) {
                        const cell = sheet.getCell(r, c);
                        cell.wrapStrategy = 'WRAP';
                        cell.verticalAlignment = 'TOP';
                    }
                }
                await sheet.saveUpdatedCells();
            } catch (formatErr) {
                console.error('Lỗi khi định dạng ô chữ:', formatErr);
            }
            
            console.log(`✅ Đã lưu và căn chỉnh ${rowsToAdd.length} kết quả ghép nối vào Google Sheets.`);
        }
        return { success: true };
    } catch (error) {
        console.error('❌ Lỗi khi lưu kết quả ghép nối:', error);
        return { success: false, error: error.message };
    }
}

export async function addCollectedPost(type, content, link, images) {
    try {
        const doc = await getDoc();
        const sheetTitle = type === 'khach' ? 'KhachCanThue' : 'NhaDangTrong';
        
        const headers = type === 'khach' 
            ? ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Ngân sách', 'Số phòng', 'Yêu cầu khác', 'Tên Khách', 'Mã Khách', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý']
            : ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Giá thuê', 'Số phòng', 'Tiện ích', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý'];
            
        const sheet = await getOrCreateSheet(doc, sheetTitle, headers);
        
        // Kiểm tra bài viết trùng lặp (dựa trên nội dung gốc)
        const rows = await sheet.getRows();
        const isDuplicate = rows.some(row => row.get('Nội dung gốc') && row.get('Nội dung gốc').trim() === content.trim());
        if (isDuplicate) {
            console.log(`⚠️ Bài viết đã tồn tại trong ${sheetTitle}, bỏ qua.`);
            return { success: false, error: 'Bài viết này đã được lưu trước đó.' };
        }

        const rowData = {
            'Ngày': new Date().toLocaleDateString('vi-VN'),
            'Nội dung gốc': content,
            'Link bài': link,
            'Đã xử lý AI': 'NO',
            'Hình ảnh': images || ''
        };
        
        if (type === 'khach') {
            rowData['Mã Khách'] = 'KH' + Math.floor(10000 + Math.random() * 90000);
        }
        
        await sheet.addRow(rowData);
        console.log(`✅ Đã thêm 1 bài viết mới vào ${sheetTitle}`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Lỗi khi thêm bài viết vào ${type}:`, error);
        return { success: false, error: error.message };
    }
}

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: privateKey.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function run() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    let sheet = doc.sheetsByTitle['KhachCanThue'];
    const headersK = ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Ngân sách', 'Số phòng', 'Yêu cầu khác', 'Tên Khách', 'Mã Khách', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý', 'Trạng thái'];
    await sheet.setHeaderRow(headersK);
    console.log("Đã cập nhật header cho sheet KhachCanThue!");

    let sheetNha = doc.sheetsByTitle['NhaDangTrong'];
    const headersNha = ['Ngày', 'Nội dung gốc', 'Link bài', 'Đã xử lý AI', 'Khu vực', 'Giá thuê', 'Số phòng', 'Tiện ích', 'Hình ảnh', 'Số điện thoại', 'Vị trí địa lý', 'Trạng thái'];
    await sheetNha.setHeaderRow(headersNha);
    console.log("Đã cập nhật header cho sheet NhaDangTrong!");
}
run().catch(console.error);

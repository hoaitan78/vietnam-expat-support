import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function clearSheet() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByTitle['KetQuaGhepNoi'];
    if (sheet) {
        console.log('Đang xóa các dòng cũ bị lỗi định dạng cột...');
        const rows = await sheet.getRows();
        
        for (const row of rows) {
            try {
                await row.delete();
            } catch (e) {
                console.error('Lỗi khi xóa dòng:', e.message);
            }
        }
        console.log(`Đã xóa ${rows.length} dòng cũ. Hệ thống sẵn sàng ghi dữ liệu mới.`);
    }
}
clearSheet().catch(console.error);

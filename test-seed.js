require('dotenv').config({ path: '.env.local' });
const { getDoc } = require('./services/googleSheets.js'); // Cannot import unexported getDoc, I need to fetch sheets manually here
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function seed() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL || '',
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const khachSheet = doc.sheetsByTitle['KhachCanThue'];
    const nhaSheet = doc.sheetsByTitle['NhaDangTrong'];
    
    await khachSheet.addRows([
        {
            'Ngày': '07/05/2026',
            'Nội dung gốc': 'Hi guys, I am looking for an apartment in Muong Thanh Vien Trieu for 2 people. Budget is around 6 million VND. Must have a balcony and kitchen. Thanks!',
            'Link bài': 'fb.com/post/1'
        },
        {
            'Ngày': '07/05/2026',
            'Nội dung gốc': 'Cần tìm phòng studio gần trung tâm, giá khoảng 4 triệu. Ưu tiên có máy giặt riêng.',
            'Link bài': 'fb.com/post/2'
        }
    ]);
    
    await nhaSheet.addRows([
        {
            'Ngày': '07/05/2026',
            'Nội dung gốc': 'Cho thuê căn hộ Mường Thanh Viễn Triều 2 phòng ngủ, full nội thất, view biển đẹp. Giá 6.5 tr/tháng. LH 09xxx.',
            'Link bài': 'fb.com/nha/1'
        },
        {
            'Ngày': '07/05/2026',
            'Nội dung gốc': 'Trống 1 căn studio ở hẻm Nguyễn Thiện Thuật, ngay khu phố tây. Giá 4.5tr, có máy giặt riêng, giờ giấc tự do.',
            'Link bài': 'fb.com/nha/2'
        }
    ]);
    
    console.log('Seed mock data thành công!');
}

seed();

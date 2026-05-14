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
    
    let sheetNha = doc.sheetsByTitle['NhaDangTrong'];
    const rows = await sheetNha.getRows();
    if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        console.log("Last row Hình ảnh:", lastRow.get('Hình ảnh'));
        console.log("Last row Nội dung:", lastRow.get('Nội dung gốc').substring(0, 50));
    } else {
        console.log("Sheet empty");
    }
}
run().catch(console.error);

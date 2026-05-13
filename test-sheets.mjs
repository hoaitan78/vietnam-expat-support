import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function test() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const khachSheet = doc.sheetsByTitle['KhachCanThue'];
    if (khachSheet) {
        await khachSheet.loadHeaderRow();
        console.log('KhachCanThue headers:', khachSheet.headerValues);
        const rows = await khachSheet.getRows();
        if (rows.length > 0) {
            console.log('Khach row 0 raw data:', rows[0]._rawData);
            console.log('Khach row 0 headers to raw values:');
            khachSheet.headerValues.forEach((header, index) => {
               console.log(`  ${header} -> ${rows[0]._rawData[index]}`);
            });
        }
    }
    
    const kqSheet = doc.sheetsByTitle['KetQuaGhepNoi'];
    if (kqSheet) {
        await kqSheet.loadHeaderRow();
        console.log('\nKetQuaGhepNoi headers:', kqSheet.headerValues);
        const rows = await kqSheet.getRows();
        if (rows.length > 0) {
            console.log('KQ row length:', rows.length);
            console.log('KQ row last raw data:');
            const lastRow = rows[rows.length - 1];
            kqSheet.headerValues.forEach((header, index) => {
               console.log(`  ${header} -> ${lastRow._rawData[index]}`);
            });
        }
    }
}
test().catch(console.error);

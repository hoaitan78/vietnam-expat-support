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
    const sheet = doc.sheetsByTitle['KhachCanThue'];
    const rows = await sheet.getRows();
    console.log("Headers:", sheet.headerValues);
    console.log("First row:", rows.length > 0 ? rows[0]._rawData : 'empty');
    
    const sheetNha = doc.sheetsByTitle['NhaDangTrong'];
    const rowsNha = await sheetNha.getRows();
    console.log("Headers NhaDangTrong:", sheetNha.headerValues);
    console.log("First row NhaDangTrong:", rowsNha.length > 0 ? rowsNha[0]._rawData : 'empty');
}
run().catch(console.error);

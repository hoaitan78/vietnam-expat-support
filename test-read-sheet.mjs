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
    const sheet = doc.sheetsByTitle['KetQuaGhepNoi'];
    const rows = await sheet.getRows();
    console.log("Headers:", sheet.headerValues);
    console.log("Total rows:", rows.length);
    console.log("Last 2 rows:");
    for (let i = Math.max(0, rows.length - 2); i < rows.length; i++) {
        const row = rows[i];
        console.log("Row", i, ":", row._rawData);
    }
}
run().catch(console.error);

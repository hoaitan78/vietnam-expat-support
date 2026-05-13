import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function fixWrap() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByTitle['KetQuaGhepNoi'];
    if (sheet) {
        const rows = await sheet.getRows();
        if (rows.length === 0) return;
        
        const lastRowIndex = rows[rows.length - 1].rowNumber;
        console.log(`Loading cells up to row ${lastRowIndex}...`);
        
        await sheet.loadCells({
            startRowIndex: 1, // Skip header (index 0)
            endRowIndex: lastRowIndex,
            startColumnIndex: 0,
            endColumnIndex: 10
        });
        
        for (let r = 1; r < lastRowIndex; r++) {
            for (let c = 0; c < 10; c++) {
                try {
                    const cell = sheet.getCell(r, c);
                    cell.wrapStrategy = 'WRAP';
                    cell.verticalAlignment = 'TOP';
                } catch (e) {
                    // Ignore errors for individual cells
                }
            }
        }
        
        console.log('Saving updated cells...');
        await sheet.saveUpdatedCells();
        console.log('Done!');
    }
}
fixWrap().catch(console.error);

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function formatAllSheets() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const sheetNames = ['KhachCanThue', 'NhaDangTrong', 'KetQuaGhepNoi'];
    
    for (const sheetName of sheetNames) {
        const sheet = doc.sheetsByTitle[sheetName];
        if (sheet) {
            console.log(`Đang định dạng (Wrap Text) cho sheet: ${sheetName}...`);
            const rows = await sheet.getRows();
            if (rows.length === 0) continue;
            
            const lastRowIndex = rows[rows.length - 1].rowNumber;
            const columnCount = sheet.headerValues.length;
            
            await sheet.loadCells({
                startRowIndex: 0, 
                endRowIndex: lastRowIndex,
                startColumnIndex: 0,
                endColumnIndex: columnCount
            });
            
            let changed = 0;
            const solidBorder = { style: 'SOLID', color: { red: 0, green: 0, blue: 0, alpha: 1 } };
            
            for (let r = 0; r < lastRowIndex; r++) {
                for (let c = 0; c < columnCount; c++) {
                    const cell = sheet.getCell(r, c);
                    cell.wrapStrategy = 'WRAP';
                    cell.verticalAlignment = 'TOP';
                    
                    // Add borders
                    cell.borders = {
                        top: solidBorder,
                        bottom: solidBorder,
                        left: solidBorder,
                        right: solidBorder
                    };
                    
                    // Format header
                    if (r === 0) {
                        cell.backgroundColor = { red: 0.85, green: 0.9, blue: 0.95 }; // Light blue
                        cell.textFormat = { bold: true };
                        cell.horizontalAlignment = 'CENTER';
                        cell.verticalAlignment = 'MIDDLE';
                    }
                    
                    changed++;
                }
            }
            
            if (changed > 0) {
                console.log(`Đang lưu ${changed} ô đã thay đổi trên ${sheetName}...`);
                await sheet.saveUpdatedCells();
            }
        }
    }
    console.log('Hoàn thành!');
}
formatAllSheets().catch(console.error);

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

function extractPhone(text) {
    if (!text) return '';
    const textWithoutLinks = text.replace(/https?:\/\/[^\s]+/g, '');
    const matches = textWithoutLinks.match(/(?:0|\+84)[ \-\.]?[35789](?:[ \-\.]?\d){8}\b/g);
    if (matches) {
        const cleaned = matches.map(p => p.replace(/[ \-\.]/g, ''));
        return [...new Set(cleaned)].join(', ');
    }
    return '';
}

async function fixPhones() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    for (const sheetName of ['KhachCanThue', 'NhaDangTrong']) {
        const sheet = doc.sheetsByTitle[sheetName];
        if (sheet) {
            console.log(`Fixing phones in ${sheetName}...`);
            const rows = await sheet.getRows();
            if (rows.length === 0) continue;
            
            await sheet.loadHeaderRow();
            const contentColIdx = sheet.headerValues.indexOf('Nội dung gốc');
            const phoneColIdx = sheet.headerValues.indexOf('Số điện thoại');
            
            if (contentColIdx === -1 || phoneColIdx === -1) {
                console.log(`Missing columns in ${sheetName}`);
                continue;
            }
            
            const lastRowIndex = rows[rows.length - 1].rowNumber;
            
            await sheet.loadCells({
                startRowIndex: 1, // Skip header (index 0)
                endRowIndex: lastRowIndex,
                startColumnIndex: 0,
                endColumnIndex: sheet.headerValues.length
            });
            
            let changed = 0;
            for (let r = 1; r < lastRowIndex; r++) {
                try {
                    const contentCell = sheet.getCell(r, contentColIdx);
                    const phoneCell = sheet.getCell(r, phoneColIdx);
                    
                    const content = contentCell.value || '';
                    const currentPhone = phoneCell.value;
                    const extracted = extractPhone(content);
                    
                    if (extracted && currentPhone !== extracted) {
                        phoneCell.value = extracted;
                        changed++;
                    }
                } catch (e) {
                     // ignore
                }
            }
            
            if (changed > 0) {
                console.log(`Saving ${changed} cells in ${sheetName}...`);
                await sheet.saveUpdatedCells();
            } else {
                console.log(`No changes needed in ${sheetName}`);
            }
        }
    }
    console.log('Done fix-phones.mjs!');
}
fixPhones().catch(console.error);

require('dotenv').config({ path: '.env.local' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL || '',
  key: privateKey.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function cleanOldPosts() {
    try {
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo(); 
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        const now = new Date();
        const ictTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
        const currentDay = ictTime.getDate();
        const currentMonth = ictTime.getMonth() + 1;
        const currentYear = ictTime.getFullYear();
        const currentDateNum = currentYear * 10000 + currentMonth * 100 + currentDay;

        let deletedCount = 0;
        for (const row of rows) {
            const postDateStr = row.get('Ngày đăng')?.trim();
            if (postDateStr) {
               const parts = postDateStr.split('/');
               if (parts.length === 3) {
                   const y = parseInt(parts[2], 10);
                   const m = parseInt(parts[1], 10);
                   const d = parseInt(parts[0], 10);
                   const postDateNum = y * 10000 + m * 100 + d;
                   
                   if (postDateNum < currentDateNum) {
                       console.log(`Deleting old post from ${postDateStr}...`);
                       await row.delete();
                       deletedCount++;
                   }
               }
            }
        }
        console.log(`✅ Successfully deleted ${deletedCount} old posts.`);
    } catch (error) {
        console.error('❌ Error cleaning up:', error);
    }
}

cleanOldPosts();

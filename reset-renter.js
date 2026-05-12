require('dotenv').config({ path: '.env.local' });
const { getRenters } = require('./services/googleSheets.js');

async function resetRenters() {
    console.log('Đang reset trạng thái xử lý AI của khách hàng...');
    const renters = await getRenters();
    let count = 0;
    for (const row of renters) {
        row.set('Đã xử lý AI', 'NO');
        await row.save();
        count++;
    }
    console.log(`Đã reset thành công ${count} khách hàng. Vui lòng chạy lại node run-matcher.js`);
}

resetRenters().catch(console.error);

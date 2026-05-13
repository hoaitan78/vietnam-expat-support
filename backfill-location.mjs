import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getRenters, getListings } from './services/googleSheets.js';
import { classifyLocation } from './services/aiMatcher.js';

async function run() {
    console.log("Đang cập nhật Vị trí địa lý cho các Khách hàng cũ...");
    const renters = await getRenters();
    for (const r of renters) {
        if (!r.get('Vị trí địa lý') && r.get('Khu vực')) {
            r.set('Vị trí địa lý', classifyLocation(r.get('Khu vực')));
            await r.save();
        }
    }
    
    console.log("Đang cập nhật Vị trí địa lý cho các Căn nhà cũ...");
    const listings = await getListings();
    for (const l of listings) {
        if (!l.get('Vị trí địa lý') && l.get('Khu vực')) {
            l.set('Vị trí địa lý', classifyLocation(l.get('Khu vực')));
            await l.save();
        }
    }
    console.log("✅ Cập nhật xong toàn bộ dữ liệu cũ!");
}
run();

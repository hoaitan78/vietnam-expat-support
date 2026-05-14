import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getRenters, getListings } from './services/googleSheets.js';

async function update() {
    console.log("Đang cập nhật headers...");
    await getRenters();
    await getListings();
    console.log("Xong!");
}

update().catch(console.error);

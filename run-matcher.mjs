import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getRenters, getListings, updateRenterAIInfo, updateListingAIInfo, saveMatchResults } from './services/googleSheets.js';
import { extractRenterNeeds, extractListingInfo, matchRenterAndListings } from './services/aiMatcher.js';

const delay = ms => new Promise(res => setTimeout(res, ms));

function extractPhone(text) {
    if (!text) return '';
    // Tìm các chuỗi có vẻ giống số điện thoại VN (10 số, bắt đầu bằng 0, có thể có khoảng trắng hoặc chấm)
    const matches = text.match(/(?:0|\\+84)[ \\-\\.]?[35789](?:[ \\-\\.]?\\d){8}\\b/g);
    if (matches) {
        // Làm sạch và lấy các số duy nhất
        const cleaned = matches.map(p => p.replace(/[ \\-\\.]/g, ''));
        return [...new Set(cleaned)].join(', ');
    }
    return '';
}

async function processData() {
    console.log('--- BƯỚC 1: Lấy dữ liệu từ Google Sheets ---');
    const renters = await getRenters();
    const listings = await getListings();

    console.log(`Tìm thấy ${renters.length} Khách cần thuê và ${listings.length} Nhà đang trống.`);

    if (renters.length === 0 || listings.length === 0) {
        console.log('Chưa có đủ dữ liệu để ghép nối. Vui lòng nhập thêm dữ liệu vào Google Sheets.');
        return;
    }

    console.log('\n--- BƯỚC 2: AI phân tích dữ liệu Khách ---');
    const processedRenters = [];
    for (let i = 0; i < renters.length; i++) {
        const row = renters[i];
        if (row.get('Đã xử lý AI') !== 'YES') {
            const rawContent = row.get('Nội dung gốc');
            if (rawContent) {
                console.log(`Đang phân tích Khách [${i + 1}]: ${rawContent.substring(0, 30)}...`);
                const aiData = await extractRenterNeeds(rawContent);
                if (aiData) {
                    await updateRenterAIInfo(row, aiData);
                    // Lấy dữ liệu đã cập nhật
                    row._rawData[3] = 'YES'; // Đã xử lý
                    row._rawData[4] = aiData.location;
                    row._rawData[5] = aiData.budget;
                    row._rawData[6] = aiData.bedrooms;
                    row._rawData[7] = aiData.other_requirements;
                    row._rawData[8] = aiData.name || 'Chưa rõ';
                    row._rawData[11] = aiData.phone;
                }
                // Thêm delay 5 giây để tránh lỗi quá giới hạn request API
                await delay(5000);
            }
        }
        processedRenters.push({
            row,
            'Mã Khách': row.get('Mã Khách') || 'Chưa rõ',
            'Tên Khách': row.get('Tên Khách') || 'Chưa rõ',
            'Khu vực': row.get('Khu vực'),
            'Ngân sách': row.get('Ngân sách'),
            'Số phòng': row.get('Số phòng'),
            'Yêu cầu khác': row.get('Yêu cầu khác'),
            'Link': row.get('Link bài') || 'Không có link',
            'Nội dung gốc': row.get('Nội dung gốc') || '',
            'Số điện thoại': row.get('Số điện thoại') || ''
        });
    }

    console.log('\n--- BƯỚC 3: AI phân tích dữ liệu Nhà ---');
    const processedListings = [];
    for (let i = 0; i < listings.length; i++) {
        const row = listings[i];
        if (row.get('Đã xử lý AI') !== 'YES') {
            const rawContent = row.get('Nội dung gốc');
            if (rawContent) {
                console.log(`Đang phân tích Nhà [${i + 1}]: ${rawContent.substring(0, 30)}...`);
                const aiData = await extractListingInfo(rawContent);
                if (aiData) {
                    await updateListingAIInfo(row, aiData);
                    row._rawData[3] = 'YES';
                    row._rawData[4] = aiData.location;
                    row._rawData[5] = aiData.price;
                    row._rawData[6] = aiData.bedrooms;
                    row._rawData[7] = aiData.amenities;
                    // Note: 'Hình ảnh' is at index 8, 'Số điện thoại' is at index 9
                    row._rawData[9] = aiData.phone;
                }
                // Thêm delay 5 giây để tránh lỗi quá giới hạn request API
                await delay(5000);
            }
        }
        processedListings.push({
            row,
            'Khu vực': row.get('Khu vực'),
            'Giá thuê': row.get('Giá thuê'),
            'Số phòng': row.get('Số phòng'),
            'Tiện ích': row.get('Tiện ích'),
            'Link': row.get('Link bài') || 'Không có link',
            'Nội dung gốc': row.get('Nội dung gốc') || '',
            'Hình ảnh': row.get('Hình ảnh') || '',
            'Số điện thoại': row.get('Số điện thoại') || ''
        });
    }

    console.log('\n--- BƯỚC 4: AI Ghép Nối Nhu Cầu ---');
    const finalMatches = [];
    
    for (let i = 0; i < processedRenters.length; i++) {
        const renter = processedRenters[i];
        console.log(`Đang tìm nhà phù hợp cho khách [${i + 1}]...`);
        
        const topMatches = await matchRenterAndListings(renter, processedListings);
        await delay(15000); // Tăng delay lên 15 giây để tránh lỗi Quá tải API
        
        if (topMatches && topMatches.length > 0) {
            for (const match of topMatches) {
                const listing = processedListings[match.listing_index];
                if (listing) {
                    finalMatches.push({
                        renterId: renter['Mã Khách'],
                        renterLink: renter['Link'],
                        renterRawInfo: renter['Nội dung gốc'],
                        renterPhone: renter['Số điện thoại'] || extractPhone(renter['Nội dung gốc']),
                        listingLink: listing['Link'],
                        listingRawInfo: listing['Nội dung gốc'],
                        listingPhone: listing['Số điện thoại'] || extractPhone(listing['Nội dung gốc']),
                        score: match.score,
                        scoreAndReason: `Độ phù hợp: ${match.score}%\nLý do: ${match.reason}`,
                        listingImages: listing['Hình ảnh']
                    });
                }
            }
        }
    }

    console.log('\n--- BƯỚC 5: Lưu kết quả ---');
    const validMatches = finalMatches.filter(m => m.score >= 70);
    
    if (validMatches.length > 0) {
        // Sắp xếp theo điểm số giảm dần
        validMatches.sort((a, b) => b.score - a.score);
        await saveMatchResults(validMatches);
    } else {
        console.log('Không tìm thấy sự phù hợp nào đáng kể.');
    }
    
    console.log('\n✅ Hoàn thành quy trình!');
}

processData().catch(console.error);

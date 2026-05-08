require('dotenv').config({ path: '.env.local' });
const { getRenters, getListings, updateRenterAIInfo, updateListingAIInfo, saveMatchResults } = require('./services/googleSheets.js');
const { extractRenterNeeds, extractListingInfo, matchRenterAndListings } = require('./services/aiMatcher.js');

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
                }
            }
        }
        processedRenters.push({
            row,
            'Khu vực': row.get('Khu vực'),
            'Ngân sách': row.get('Ngân sách'),
            'Số phòng': row.get('Số phòng'),
            'Yêu cầu khác': row.get('Yêu cầu khác'),
            'Link': row.get('Link bài') || 'Không có link'
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
                }
            }
        }
        processedListings.push({
            row,
            'Khu vực': row.get('Khu vực'),
            'Giá thuê': row.get('Giá thuê'),
            'Số phòng': row.get('Số phòng'),
            'Tiện ích': row.get('Tiện ích'),
            'Link': row.get('Link bài') || 'Không có link'
        });
    }

    console.log('\n--- BƯỚC 4: AI Ghép Nối Nhu Cầu ---');
    const finalMatches = [];
    
    for (let i = 0; i < processedRenters.length; i++) {
        const renter = processedRenters[i];
        console.log(`Đang tìm nhà phù hợp cho khách [${i + 1}]...`);
        
        const topMatches = await matchRenterAndListings(renter, processedListings);
        
        if (topMatches && topMatches.length > 0) {
            for (const match of topMatches) {
                const listing = processedListings[match.listing_index];
                if (listing) {
                    finalMatches.push({
                        renterInfo: `Cần: ${renter['Khu vực']} | ${renter['Ngân sách']} | ${renter['Số phòng']} phòng`,
                        renterLink: renter['Link'],
                        listingInfo: `Có: ${listing['Khu vực']} | ${listing['Giá thuê']} | ${listing['Số phòng']} phòng`,
                        listingLink: listing['Link'],
                        score: match.score,
                        reason: match.reason
                    });
                }
            }
        }
    }

    console.log('\n--- BƯỚC 5: Lưu kết quả ---');
    if (finalMatches.length > 0) {
        // Sắp xếp theo điểm số giảm dần
        finalMatches.sort((a, b) => b.score - a.score);
        await saveMatchResults(finalMatches);
    } else {
        console.log('Không tìm thấy sự phù hợp nào đáng kể.');
    }
    
    console.log('\n✅ Hoàn thành quy trình!');
}

processData().catch(console.error);

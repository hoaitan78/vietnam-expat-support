import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getRenters, getListings, updateRenterAIInfo, updateListingAIInfo, saveMatchResults } from './services/googleSheets.js';
import { extractRenterNeeds, extractListingInfo, matchRenterAndListings, preFilterListings } from './services/aiMatcher.js';

const delay = ms => new Promise(res => setTimeout(res, ms));

function extractPhone(text) {
    if (!text) return '';
    
    // Loại bỏ các đường link khỏi text trước khi tìm số điện thoại
    // để tránh bắt nhầm các dãy số ID trong URL (ví dụ: facebook.com/.../10001085...)
    const textWithoutLinks = text.replace(/https?:\/\/[^\s]+/g, '');

    // Tìm các chuỗi có vẻ giống số điện thoại VN (10 số, bắt đầu bằng 0, có thể có khoảng trắng hoặc chấm)
    const matches = textWithoutLinks.match(/(?:0|\+84)[ \-\.]?[35789](?:[ \-\.]?\d){8}\b/g);
    if (matches) {
        // Làm sạch và lấy các số duy nhất
        const cleaned = matches.map(p => p.replace(/[ \-\.]/g, ''));
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
                try {
                    const aiData = await extractRenterNeeds(rawContent);
                    if (aiData) {
                        await updateRenterAIInfo(row, aiData);
                    }
                } catch (e) {
                    console.error("Lỗi trích xuất AI cho Khách:", e.message);
                }
                // Thêm delay 5 giây để tránh lỗi quá giới hạn request API
                await delay(5000);
            } else {
                continue; // Bỏ qua nếu không có nội dung gốc
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
                try {
                    const aiData = await extractListingInfo(rawContent);
                    if (aiData) {
                        await updateListingAIInfo(row, aiData);
                    }
                } catch (e) {
                    console.error("Lỗi trích xuất AI cho Nhà:", e.message);
                }
                // Thêm delay 5 giây để tránh lỗi quá giới hạn request API
                await delay(5000);
            } else {
                continue; // Bỏ qua nếu không có nội dung gốc
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
    
    for (let i = 0; i < processedRenters.length; i++) {
        const renter = processedRenters[i];
        console.log(`Đang tìm nhà phù hợp cho khách [${i + 1}]...`);
        
        try {
            const filteredListings = preFilterListings(renter, processedListings);
            console.log(`Đã lọc thô: Giảm từ ${processedListings.length} xuống còn ${filteredListings.length} căn tiềm năng.`);
            
            const topMatches = await matchRenterAndListings(renter, filteredListings);
            
            if (topMatches && topMatches.length > 0) {
                const matchesForThisRenter = [];
                for (const match of topMatches) {
                    const listing = filteredListings[match.listing_index];
                    if (listing && match.score >= 70) {
                        matchesForThisRenter.push({
                            renterId: renter['Mã Khách'],
                            renterLink: renter['Link'],
                            renterRawInfo: renter['Nội dung gốc'],
                            renterPhone: renter['Số điện thoại'] || extractPhone(renter['Nội dung gốc']),
                            listingLink: listing['Link'],
                            listingRawInfo: listing['Nội dung gốc'],
                            listingPhone: listing['Số điện thoại'] || extractPhone(listing['Nội dung gốc']),
                            score: match.score,
                            scoreAndReason: `Độ phù hợp: ${match.score}%\nLý do: ${match.reason}`,
                            listingImages: listing['Hình ảnh'],
                            locationCategory: listing['Vị trí địa lý'] || 'Unknown'
                        });
                    }
                }
                
                if (matchesForThisRenter.length > 0) {
                    // Sắp xếp theo vị trí địa lý, sau đó theo điểm giảm dần
                    const locationWeight = {
                        'Bắc Nha Trang': 1,
                        'Trung tâm': 2,
                        'Nam Nha Trang': 3,
                        'Unknown': 4
                    };
                    
                    matchesForThisRenter.sort((a, b) => {
                        const weightA = locationWeight[a.locationCategory] || 4;
                        const weightB = locationWeight[b.locationCategory] || 4;
                        if (weightA !== weightB) {
                            return weightA - weightB;
                        }
                        return b.score - a.score;
                    });
                    
                    await saveMatchResults(matchesForThisRenter);
                } else {
                    console.log(`Không tìm thấy sự phù hợp nào >= 70 điểm cho khách [${i + 1}].`);
                }
            }
        } catch (error) {
             console.error(`Lỗi khi ghép nối khách [${i + 1}]:`, error.message);
             console.log("Sẽ lưu các kết quả đã ghép nối được và tiếp tục...");
        }
        
        await delay(30000); // Tăng delay lên 30 giây giữa mỗi khách để tránh 429 Too Many Requests
    }
    
    console.log('\n✅ Hoàn thành quy trình!');
}

processData().catch(console.error);

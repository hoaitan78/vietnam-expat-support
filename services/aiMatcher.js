import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

function parseAIResponse(text) {
    try {
        const cleanText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Lỗi parse JSON từ AI:", text);
        return null;
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function generateContentWithRetry(prompt, retries = 3) {
    const model = getModel();
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            if (error.status === 429 && i < retries - 1) {
                const waitTime = 30000 * (i + 1); // 30s, 60s
                console.log(`[API] Quá tải request. Đang thử lại sau ${waitTime / 1000} giây...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
}

export async function extractRenterNeeds(postContent) {
    const model = getModel();
    const prompt = `
        Bạn là một chuyên gia môi giới bất động sản tại Nha Trang. 
        Hãy đọc đoạn văn bản sau của một khách hàng đang tìm thuê nhà/căn hộ và trích xuất các thông tin chính xác.
        
        Nội dung bài đăng: "${postContent}"
        
        Trả về kết quả dưới dạng JSON theo đúng định dạng sau. KHÔNG giải thích thêm:
        {
            "name": "Tên khách hàng (nếu có, ví dụ từ tên tác giả hoặc xưng hô). Nếu không rõ, ghi 'Khách từ Facebook'",
            "location": "Khu vực mong muốn (vd: Mường Thanh, Vĩnh Điềm Trung, Hòn Chồng... Nếu không rõ ghi 'Chưa rõ')",
            "budget": "Ngân sách tối đa hoặc khoảng giá (vd: 5-7 triệu, 10tr... Nếu không rõ ghi 'Chưa rõ')",
            "bedrooms": "Số phòng ngủ mong muốn (vd: 1, 2, Studio... Nếu không rõ ghi 'Chưa rõ')",
            "other_requirements": "Các yêu cầu khác (vd: nuôi pet, ban công, có bếp... Tóm tắt ngắn gọn. Nếu không có ghi 'Không')",
            "phone": "Số điện thoại liên hệ tìm thấy trong bài (vd: 0907329309, +84... Nếu không có ghi 'Không')"
        }
    `;
    
    const result = await generateContentWithRetry(prompt);
    return parseAIResponse(result.response.text().trim());
}

export async function extractListingInfo(postContent) {
    const model = getModel();
    const prompt = `
        Bạn là một chuyên gia môi giới bất động sản tại Nha Trang. 
        Hãy đọc đoạn văn bản sau của một chủ nhà/môi giới đang đăng cho thuê nhà/căn hộ và trích xuất các thông tin chính xác.
        
        Nội dung bài đăng: "${postContent}"
        
        Trả về kết quả dưới dạng JSON theo đúng định dạng sau. KHÔNG giải thích thêm:
        {
            "location": "Khu vực nhà/căn hộ (vd: Mường Thanh Viễn Triều, CT1 Vĩnh Điềm Trung... Nếu không rõ ghi 'Chưa rõ')",
            "price": "Giá thuê (vd: 6 triệu, 15tr... Nếu không rõ ghi 'Chưa rõ')",
            "bedrooms": "Số phòng ngủ (vd: 1, 2, Studio... Nếu không rõ ghi 'Chưa rõ')",
            "amenities": "Tiện ích nổi bật (vd: đầy đủ nội thất, view biển, free wifi... Tóm tắt ngắn gọn)",
            "phone": "Số điện thoại liên hệ tìm thấy trong bài (vd: 0907329309, +84... Nếu không có ghi 'Không')"
        }
    `;
    
    const result = await generateContentWithRetry(prompt);
    return parseAIResponse(result.response.text().trim());
}

export async function matchRenterAndListings(renter, listings) {
    const model = getModel();
    const prompt = `
        Bạn là một chuyên gia ghép nối bất động sản thông minh.
        Tôi có 1 khách hàng đang tìm thuê nhà với các nhu cầu sau:
        - Khu vực: ${renter['Khu vực']}
        - Ngân sách: ${renter['Ngân sách']}
        - Số phòng: ${renter['Số phòng']}
        - Yêu cầu khác: ${renter['Yêu cầu khác']}

        Dưới đây là danh sách các căn nhà đang trống:
        ${listings.map((l, index) => `
        [Căn số ${index + 1}]
        - Khu vực: ${l['Khu vực']}
        - Giá thuê: ${l['Giá thuê']}
        - Số phòng: ${l['Số phòng']}
        - Tiện ích: ${l['Tiện ích']}
        `).join('\n')}

        Hãy tính toán và trả về điểm phù hợp (score từ 0 đến 100) của TỪNG căn nhà cho khách hàng này theo đúng thang điểm sau:

        1. Khu vực (Tối đa 40 điểm):
           - Match chính xác hoặc theo từ khóa (Ví dụ: "Phía Bắc Nha Trang" khớp với "Vĩnh Hải", "Scenia Bay", "Phạm Văn Đồng", "Khu Bắc". "Trung tâm" khớp với "Lộc Thọ", "Tân Lập", "Xương Huân").
           - Khớp hoàn toàn: 40 điểm. Khớp một phần hoặc gần đó: 20-30 điểm. Không khớp/Quá xa: 0 điểm.

        2. Ngân sách (Tối đa 30 điểm):
           - Nếu Giá thuê <= Ngân sách khách: 30 điểm (Ưu tiên giá sát ngân sách nhất).
           - Nếu Giá thuê cao hơn ngân sách một chút (dưới 10%): 15 điểm.
           - Nếu Giá thuê cao hơn ngân sách quá 15%: 0 điểm.

        3. Số phòng (Tối đa 20 điểm):
           - Match đúng số phòng: 20 điểm.
           - Match gần đúng (Khách cần "1-2 phòng", nhà có "1 phòng" hoặc "2 phòng"): 20 điểm.
           - Không khớp (Khách cần 2 phòng, nhà có 1 phòng): 0 điểm.

        4. Tiện ích (Tối đa 10 điểm):
           - Cộng điểm (mỗi tiện ích 2-3 điểm, tối đa 10) nếu nhà có: ban công, view biển, hồ bơi, pet friendly, full nội thất, yên tĩnh.
           - Nếu khách yêu cầu bắt buộc (ví dụ: nuôi pet) mà nhà cấm pet: Trừ ngay lập tức 50 điểm vào tổng điểm.

        Lưu ý bắt buộc: 
        - Một khách có thể hợp nhiều nhà. Trả về tất cả các nhà có tổng điểm (score) >= 70.
        - Nếu không có căn nào đạt >= 70 điểm, trả về mảng rỗng [].
        - Xếp hạng mảng trả về theo thứ tự score giảm dần.
        
        Trả về kết quả dưới dạng mảng JSON theo định dạng sau. KHÔNG giải thích thêm:
        [
            {
                "listing_index": 0, // Vị trí của căn nhà trong danh sách (từ 0 đến n-1)
                "score": 95, // Điểm phù hợp (0-100)
                "reason": "Giải thích dựa trên 4 ưu tiên: [Điểm mạnh]... [Cần đàm phán]... "
            }
        ]
    `;

    const result = await generateContentWithRetry(prompt);
    return parseAIResponse(result.response.text().trim());
}

export function parsePrice(priceString) {
    if (!priceString || typeof priceString !== 'string') return null;
    const s = priceString.toLowerCase();
    if (s.includes('chưa rõ') || s.includes('thỏa thuận')) return null;
    
    // Normalize format
    const normalized = s.replace(/,/g, '.');
    // Bắt số thập phân (vd: 5.5, 12, 10.000.000)
    const match = normalized.match(/\d+(\.\d+)?/);
    if (!match) return null;
    
    let price = parseFloat(match[0]);
    // Nếu giá ghi đầy đủ số 0 (vd 5000000) thì đưa về đơn vị "triệu" (5)
    if (price > 1000) {
        price = price / 1000000;
    }
    return price;
}

export function preFilterListings(renter, listings) {
    const renterBudgetStr = renter['Ngân sách'];
    const renterBudget = parsePrice(renterBudgetStr);
    
    if (!renterBudget) return listings;
    
    let filtered = listings.filter(listing => {
        const listingPriceStr = listing['Giá thuê'];
        const listingPrice = parsePrice(listingPriceStr);
        
        if (!listingPrice) return true;
        
        if (listingPrice > renterBudget * 1.3) {
            return false;
        }
        
        return true;
    });
    
    if (filtered.length > 30) {
        filtered = filtered.slice(0, 30);
    }
    
    return filtered;
}

export function classifyLocation(locationString) {
    if (!locationString) return 'Unknown';
    const s = locationString.toLowerCase();
    
    // Bắc Nha Trang
    const northKeywords = ['vĩnh hải', 'vĩnh hòa', 'vĩnh phước', 'vĩnh thọ', 'ba làng', 'phạm văn đồng', 'viễn triều', 'scenia', 'hòn chồng', 'đồng đế', 'bắc'];
    if (northKeywords.some(kw => s.includes(kw))) return 'Bắc Nha Trang';
    
    // Nam Nha Trang
    const southKeywords = ['vĩnh trường', 'vĩnh nguyên', 'phước long', 'bình tân', 'an viên', 'nam nha trang', 'phía nam'];
    if (southKeywords.some(kw => s.includes(kw))) return 'Nam Nha Trang';
    
    // Trung tâm
    const centerKeywords = ['lộc thọ', 'tân lập', 'xương huân', 'phước tiến', 'phước tân', 'phước hòa', 'vạn thắng', 'vạn thạnh', 'phương sài', 'phương sơn', 'ngọc hiệp', 'trần phú', 'vcn phước hải', 'lê thánh tôn', 'nguyễn thiện thuật', 'hùng vương', 'trung tâm', 'chợ đầm', 'gold coast', 'panorama', 'nha trang center'];
    if (centerKeywords.some(kw => s.includes(kw))) return 'Trung tâm';
    
    // Default fallback
    if (s.includes('chưa rõ') || s.includes('không')) return 'Unknown';
    
    // If we have some specific area not covered, we might just return Unknown or let it be.
    return 'Unknown';
}

import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
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
                console.log(`[API] Quá tải request. Đang thử lại sau ${15 * (i + 1)} giây...`);
                await delay(15000 * (i + 1));
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
            "other_requirements": "Các yêu cầu khác (vd: nuôi pet, ban công, có bếp... Tóm tắt ngắn gọn. Nếu không có ghi 'Không')"
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
            "amenities": "Tiện ích nổi bật (vd: đầy đủ nội thất, view biển, free wifi... Tóm tắt ngắn gọn)"
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

        Hãy đánh giá độ phù hợp của TỪNG căn nhà đối với khách hàng này dựa trên tiêu chí sau (tuân thủ nghiêm ngặt):
        
        Ưu tiên 1: Tiêu chí loại trừ (Deal-breakers) – Bắt buộc phải khớp. Nếu không đáp ứng -> Bỏ qua (Điểm 0)
        - Ngân sách: Nếu Giá thuê vượt quá 10-15% Ngân sách tối đa của khách -> Loại.
        - Vị trí: Nếu khu vực quá xa hoặc không phù hợp yêu cầu di chuyển cốt lõi -> Loại.
        - Giới hạn khắt khe: Nếu khách nuôi thú cưng nhưng tiện ích không cho phép hoặc cấm -> Loại.

        Ưu tiên 2: Tiêu chí cốt lõi (Core Needs) – Quan trọng nhất
        - Số phòng: Phải đáp ứng đúng hoặc hơn số lượng phòng khách yêu cầu.
        - An ninh khu vực và tình trạng nhà cơ bản.

        Ưu tiên 3: Tiêu chí có thể đàm phán (Negotiables) – Linh hoạt
        - Nội thất (có thể đàm phán sắm thêm), chính sách cọc, sửa chữa nhỏ (sơn tường, thay rèm). Thiếu nhưng có thể đàm phán thì vẫn giữ điểm tốt.

        Ưu tiên 4: Tiêu chí cộng thêm (Nice-to-haves) – Điểm cộng
        - View ban công đẹp, nhiều ánh sáng tự nhiên.
        - Gần cafe, công viên, phòng gym theo sở thích.
        
        Lưu ý: Chỉ trả về top 3 căn nhà có điểm cao nhất (từ cao xuống thấp). Nếu không có căn nào vượt qua được Tiêu chí loại trừ (Deal-breakers), có thể trả về mảng rỗng [].
        
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

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

export async function extractRenterNeeds(postContent) {
    const model = getModel();
    const prompt = `
        Bạn là một chuyên gia môi giới bất động sản tại Nha Trang. 
        Hãy đọc đoạn văn bản sau của một khách hàng đang tìm thuê nhà/căn hộ và trích xuất các thông tin chính xác.
        
        Nội dung bài đăng: "${postContent}"
        
        Trả về kết quả dưới dạng JSON theo đúng định dạng sau. KHÔNG giải thích thêm:
        {
            "location": "Khu vực mong muốn (vd: Mường Thanh, Vĩnh Điềm Trung, Hòn Chồng... Nếu không rõ ghi 'Chưa rõ')",
            "budget": "Ngân sách tối đa hoặc khoảng giá (vd: 5-7 triệu, 10tr... Nếu không rõ ghi 'Chưa rõ')",
            "bedrooms": "Số phòng ngủ mong muốn (vd: 1, 2, Studio... Nếu không rõ ghi 'Chưa rõ')",
            "other_requirements": "Các yêu cầu khác (vd: nuôi pet, ban công, có bếp... Tóm tắt ngắn gọn. Nếu không có ghi 'Không')"
        }
    `;
    
    const result = await model.generateContent(prompt);
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
    
    const result = await model.generateContent(prompt);
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

        Hãy đánh giá độ phù hợp của TỪNG căn nhà đối với khách hàng này. 
        Trả về kết quả dưới dạng mảng JSON theo định dạng sau. Chỉ trả về top 3 căn phù hợp nhất (điểm cao nhất giảm dần). KHÔNG giải thích thêm:
        [
            {
                "listing_index": 0, // Vị trí của căn nhà trong danh sách (từ 0 đến n-1)
                "score": 95, // Điểm phù hợp (0-100)
                "reason": "Giải thích ngắn gọn tại sao căn này hợp với khách (vd: Đúng ngân sách, cùng khu vực yêu cầu, có cho nuôi pet). Câu này sẽ dùng để tư vấn trực tiếp cho khách."
            }
        ]
    `;

    const result = await model.generateContent(prompt);
    return parseAIResponse(result.response.text().trim());
}

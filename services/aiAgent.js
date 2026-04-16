import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateExpatFacebookPost(numberOfPosts = 1) {
  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
          throw new Error('Chưa cấu hình GEMINI_API_KEY trong file .env.local');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `
          Bạn là một quản trị viên thân thiện và nhiều kinh nghiệm tại Fanpage "Vietnam Expat Support" (Hỗ trợ người nước ngoài tại Việt Nam).
          Nhiệm vụ của bạn là viết ${numberOfPosts} bài đăng Facebook (Facebook Post) duy nhất trong ngày nhằm mang lại giá trị, sự gắn kết hoặc sự thú vị cho cộng đồng Expat tại Việt Nam.

          Với mỗi bài đăng, hãy chọn một chủ đề cực kỳ ngẫu nhiên và KHÁC NHAU, xoay quanh cuộc sống tại Việt Nam như: Visa, Ẩm thực đường phố, Trả giá khi mua sắm, Gọi xe Grab/Be, Địa điểm du lịch cuối tuần, Tiếng Việt cơ bản v.v...
          
          Yêu cầu định dạng CHUNG cho các bài viết:
          - Ngôn ngữ: TIẾNG ANH (có chèn vài từ tiếng Việt không dấu hoặc có dấu để tạo sự bản địa).
          - Độ dài: 150 - 300 từ mỗi bài.
          - Có sử dụng emoji sinh động, bắt mắt.
          - Kết bài luôn có 1 Câu hỏi tương tác (Call to Action) và Hashtag phù hợp.

          QUAN TRỌNG: Bạn BẮT BUỘC phải trả về kết quả dưới dạng một mảng JSON nguyên chất theo đúng format sau. KHÔNG giải thích, KHÔNG có markdown khối mã \`\`\`json.
          [
            {
              "topic": "Tên chủ đề ngắn gọn bằng tiếng Anh",
              "content": "Nội dung bài viết đầy đủ ở đây...",
              "imagePrompt": "A single descriptive sentence in English detailing an eye-catching photo for this post. Include 'photo realistic' or 'high quality' keywords. (e.g., 'A vibrant bowl of Pho on a street food stall in Hanoi, photorealistic, 4k')"
            }
          ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        // Loại bỏ markdown code block nếu Gemini có lỡ wrap vào
        const cleanText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        // Parse JSON sang mảng Javascript
        const postsResult = JSON.parse(cleanText);
        
        // Khởi tạo link Hình Ảnh từ Pollinations.AI cho từng bài
        const finalPosts = postsResult.map(post => {
           let imageUrl = '';
           if (post.imagePrompt) {
               // URL Encode cái prompt ảnh để nối vào link
               const encodedPrompt = encodeURIComponent(post.imagePrompt);
               imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true`;
           }
           return {
               ...post,
               imageUrl: imageUrl
           }
        });

        console.log(`✅ Đã tạo thành công ${finalPosts.length} ý tưởng bài viết VÀ HÌNH ẢNH từ AI!`);
        return finalPosts;
      } catch (error) {
        attempt++;
        console.error(`❌ Lỗi khi AI tạo bài viết (Lần thử ${attempt}/${maxRetries}):`, error.message);
        
        // Nếu lỗi quá tải (503), chờ 5 giây rồi thử lại, nếu hết lượt mới văng lỗi ngoài
        if (error.message.includes('503') || error.message.includes('high demand')) {
            if (attempt >= maxRetries) {
                console.error("❌ Đã quá tải cục bộ, bỏ cuộc sau 3 lần thử.");
                throw new Error("Hệ thống Google đang quá tải, vui lòng thử lại sau ít phút.");
            }
            console.log(`⏳ Google đang quá tải (503). Chờ 5 giây và thử lại...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
        }
        
        // Nếu là lỗi khác (như sai API Key, vv) thì quăng lỗi luôn không thử lại nữa
        throw error;
      }
  }
}

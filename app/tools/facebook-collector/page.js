'use client';
import { useState, useEffect } from 'react';

export default function FacebookCollectorPage() {
  const [bookmarkletCode, setBookmarkletCode] = useState('');

  useEffect(() => {
    // Generate bookmarklet code dynamically with the current origin
    const origin = window.location.origin;
    
    // The raw script to be injected
    const rawScript = `
      (function() {
        if (document.getElementById('fb-collector-overlay')) {
          return;
        }

        const selectedText = window.getSelection().toString();
        const currentUrl = window.location.href;

        const overlay = document.createElement('div');
        overlay.id = 'fb-collector-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.right = '20px';
        overlay.style.width = '350px';
        overlay.style.backgroundColor = '#ffffff';
        overlay.style.border = '1px solid #ccc';
        overlay.style.borderRadius = '8px';
        overlay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        overlay.style.zIndex = '9999999';
        overlay.style.padding = '16px';
        overlay.style.fontFamily = 'Arial, sans-serif';

        overlay.innerHTML = \`
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Lưu Bài Viết FB</h3>
            <button id="fb-coll-close" style="background: none; border: none; cursor: pointer; font-size: 16px;">&times;</button>
          </div>
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">Nội dung (Bôi đen trước khi bấm nút để tự lấy)</label>
          <textarea id="fb-coll-content" style="width: 100%; height: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 12px; box-sizing: border-box; font-size: 14px;">\${selectedText}</textarea>
          
          <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">Link Bài Viết</label>
          <input type="text" id="fb-coll-url" value="\${currentUrl}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; box-sizing: border-box; font-size: 14px;" />
          
          <div style="display: flex; gap: 8px;">
            <button id="fb-coll-khach" style="flex: 1; padding: 10px; background-color: #2e89ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+ Khách Thuê</button>
            <button id="fb-coll-nha" style="flex: 1; padding: 10px; background-color: #31a24c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+ Nhà Trống</button>
          </div>
          <div id="fb-coll-status" style="margin-top: 12px; font-size: 13px; text-align: center; color: #666;"></div>
        \`;

        document.body.appendChild(overlay);

        document.getElementById('fb-coll-close').onclick = () => overlay.remove();

        let messageHandler = null;

        const submitPost = (type) => {
          const content = document.getElementById('fb-coll-content').value;
          const url = document.getElementById('fb-coll-url').value;
          const statusDiv = document.getElementById('fb-coll-status');

          if (!content.trim()) {
            statusDiv.textContent = 'Vui lòng nhập nội dung!';
            statusDiv.style.color = 'red';
            return;
          }

          statusDiv.textContent = 'Đang mở cửa sổ...';
          statusDiv.style.color = '#666';

          const saveUrl = '${origin}/tools/facebook-collector/save';
          
          // Mở popup
          const popup = window.open(saveUrl, 'FBCollectorSave', 'width=450,height=300,left=200,top=200');

          if (!popup) {
            statusDiv.textContent = '❌ Trình duyệt chặn Popup! Hãy cho phép mở Popup.';
            statusDiv.style.color = 'red';
            return;
          }

          if (messageHandler) {
             window.removeEventListener('message', messageHandler);
          }

          messageHandler = (e) => {
            // Chỉ nhận thông báo từ server của chúng ta
            if (e.origin !== '${origin}') return;

            if (e.data === 'READY_TO_RECEIVE') {
               popup.postMessage({ action: 'SAVE_POST', type, content, url }, '${origin}');
               statusDiv.textContent = 'Đang gửi dữ liệu...';
            }
            if (e.data === 'SAVE_SUCCESS') {
               statusDiv.textContent = '✅ Đã lưu thành công!';
               statusDiv.style.color = 'green';
               window.removeEventListener('message', messageHandler);
               messageHandler = null;
               setTimeout(() => overlay.remove(), 1500);
            }
            if (e.data && e.data.action === 'SAVE_ERROR') {
               statusDiv.textContent = '❌ Lỗi: ' + e.data.error;
               statusDiv.style.color = 'red';
            }
          };

          window.addEventListener('message', messageHandler);
        };

        document.getElementById('fb-coll-khach').onclick = () => submitPost('khach');
        document.getElementById('fb-coll-nha').onclick = () => submitPost('nha');
      })();
    `;

    // Encode script to bookmarklet URL format
    const encoded = 'javascript:' + encodeURIComponent(rawScript.replace(/\s+/g, ' ').trim());
    setBookmarkletCode(encoded);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Cài đặt Công cụ Thu thập Facebook</h1>
      
      <div style={{ backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '8px', border: '1px solid #cce3ff', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', marginTop: 0, color: '#0056b3' }}>Bước 1: Kéo thả nút này lên thanh Dấu trang</h2>
        <p>Bấm giữ chuột vào nút màu xanh bên dưới, sau đó kéo và thả nó lên thanh Bookmark (Dấu trang) của trình duyệt Chrome/Cốc Cốc.</p>
        
        {bookmarkletCode ? (
          <div style={{ margin: '20px 0' }}>
            <a 
              href={bookmarkletCode}
              onClick={(e) => {
                e.preventDefault();
                alert('Vui lòng KÉO THẢ nút này lên thanh Dấu trang (Bookmark Bar), không click trực tiếp nhé!');
              }}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#2e89ff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '24px',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 6px rgba(46,137,255,0.3)',
                cursor: 'grab'
              }}
            >
              📥 FB Collector (Kéo thả tôi)
            </a>
          </div>
        ) : (
          <p>Đang tạo công cụ...</p>
        )}
        <p style={{ fontSize: '13px', color: '#666' }}>* Nếu không thấy thanh Dấu trang, ấn Ctrl + Shift + B (Windows) hoặc Cmd + Shift + B (Mac) để hiện lên.</p>
      </div>

      <div>
        <h2 style={{ fontSize: '20px' }}>Bước 2: Cách sử dụng khi lướt Facebook</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Mở Facebook và vào các Group cho thuê nhà.</li>
          <li>Khi thấy một bài viết tiềm năng: Bôi đen (chọn) phần văn bản nội dung của bài viết đó.</li>
          <li>Bấm vào nút <strong>FB Collector</strong> mà bạn vừa kéo lên thanh Dấu trang.</li>
          <li>Một bảng nhỏ sẽ hiện ra góc phải màn hình, có chứa sẵn đoạn chữ bạn vừa bôi đen và Link của bài viết hiện tại.</li>
          <li>Chọn lưu vào <strong>+ Khách Thuê</strong> hoặc <strong>+ Nhà Trống</strong>.</li>
          <li>Hệ thống sẽ tự động lưu thẳng vào Google Sheets của bạn. AI sẽ tự động phân tích sau đó!</li>
        </ol>
      </div>
    </div>
  );
}

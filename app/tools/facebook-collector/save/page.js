'use client';
import { useEffect, useState } from 'react';

export default function SavePostPopup() {
  const [status, setStatus] = useState('Đang khởi tạo...');

  useEffect(() => {
    // Báo cho tab Facebook (opener) biết là popup đã sẵn sàng nhận dữ liệu
    if (window.opener) {
      window.opener.postMessage('READY_TO_RECEIVE', '*');
    } else {
      setStatus('Lỗi: Cửa sổ này phải được mở từ nút Bookmarklet trên Facebook.');
    }

    const handleMessage = async (e) => {
       // Chỉ xử lý nếu có data và đúng action
       if (e.data && e.data.action === 'SAVE_POST') {
          setStatus('Đang lưu dữ liệu vào Google Sheets...');
          try {
             const res = await fetch('/api/collect-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   type: e.data.type,
                   content: e.data.content,
                   url: e.data.url
                })
             });
             
             const result = await res.json();
             
             if (res.ok && result.success) {
                setStatus('✅ Đã lưu thành công! Cửa sổ sẽ tự đóng...');
                if (window.opener) {
                   window.opener.postMessage('SAVE_SUCCESS', '*');
                }
                setTimeout(() => window.close(), 1500);
             } else {
                const errorMsg = result.error || 'Lỗi không xác định từ server';
                setStatus('❌ Lỗi: ' + errorMsg);
                if (window.opener) {
                   window.opener.postMessage({ action: 'SAVE_ERROR', error: errorMsg }, '*');
                }
             }
          } catch (err) {
             const errorMsg = err.message;
             setStatus('❌ Lỗi kết nối: ' + errorMsg);
             if (window.opener) {
                window.opener.postMessage({ action: 'SAVE_ERROR', error: errorMsg }, '*');
             }
          }
       }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
     <div style={{ 
       padding: '30px 20px', 
       fontFamily: 'system-ui, -apple-system, sans-serif', 
       textAlign: 'center',
       backgroundColor: '#f9fafb',
       height: '100vh',
       boxSizing: 'border-box',
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center'
     }}>
       <div style={{
         backgroundColor: 'white',
         padding: '24px',
         borderRadius: '12px',
         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
         maxWidth: '100%',
         width: '100%'
       }}>
         <h2 style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '20px' }}>Lưu Bài Viết Facebook</h2>
         <p style={{ margin: '0', color: '#4b5563', fontSize: '15px', lineHeight: '1.5' }}>
           {status}
         </p>
       </div>
     </div>
  );
}

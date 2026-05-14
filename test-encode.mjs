const rawScript = `
      (function() {
        try {
            if (document.getElementById('fb-collector-overlay')) {
              return;
            }

            const selectedText = window.getSelection().toString();
            let currentUrl = window.location.href;

            let imageUrls = [];
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                let node = selection.getRangeAt(0).commonAncestorContainer;
                if (node.nodeType === 3) node = node.parentNode;
                
                if (node && typeof node.closest === 'function') {
                    let postContainer = node.closest('[role="article"]');
                    if (postContainer) {
                        const allLinks = Array.from(postContainer.querySelectorAll('a[href]'));
                        const authorLinkEl = allLinks.find(a => (a.innerText || '').trim().length > 0 && !(a.innerText || '').includes('Tham gia') && !(a.innerText || '').includes('Join'));
                        
                        if (authorLinkEl) {
                            let href = authorLinkEl.getAttribute('href');
                            if (href.startsWith('/')) href = window.location.origin + href;
                            try {
                                const urlObj = new URL(href);
                                if (urlObj.searchParams.has('id')) {
                                    currentUrl = urlObj.origin + urlObj.pathname + '?id=' + urlObj.searchParams.get('id');
                                } else {
                                    urlObj.search = '';
                                    currentUrl = urlObj.toString();
                                }
                            } catch(e) {
                                currentUrl = href.split('?')[0];
                            }
                        }

                        const imgs = Array.from(postContainer.querySelectorAll('img'))
                            .map(img => img.src || img.getAttribute('data-src'))
                            .filter(src => src && src.startsWith('http') && !src.includes('emoji') && !src.includes('svg'));
                        imageUrls = [...new Set(imgs)].slice(0, 5);
                    }
                }
                
                if (imageUrls.length === 0) {
                    let parent = node;
                    while (parent && parent !== document.body) {
                        if (parent && typeof parent.querySelectorAll === 'function') {
                            const imgs = Array.from(parent.querySelectorAll('img'))
                                .map(img => img.src || img.getAttribute('data-src'))
                                .filter(src => src && src.startsWith('http') && !src.includes('emoji') && !src.includes('svg'));
                            
                            if (imgs.length > 0) {
                                imageUrls = [...new Set(imgs)].slice(0, 5);
                                break;
                            }
                        }
                        parent = parent.parentNode;
                    }
                }
            }
            const imagesStr = imageUrls.join('\\n');

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
              <input type="text" id="fb-coll-url" value="\${currentUrl}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 12px; box-sizing: border-box; font-size: 14px;" />
              
              <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">Link Hình ảnh (Mỗi link 1 dòng)</label>
              <textarea id="fb-coll-images" style="width: 100%; height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px; box-sizing: border-box; font-size: 12px; white-space: pre-wrap;">\${imagesStr}</textarea>
              
              <div style="display: flex; gap: 8px;">
                <button id="fb-coll-khach" style="flex: 1; padding: 10px; background-color: #2e89ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+ Khách Thuê</button>
                <button id="fb-coll-nha" style="flex: 1; padding: 10px; background-color: #31a24c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+ Nhà Trống</button>
              </div>
              <div id="fb-coll-status" style="margin-top: 12px; font-size: 13px; text-align: center; color: #666;"></div>
            \`;

            document.body.appendChild(overlay);

            document.getElementById('fb-coll-close').onclick = () => overlay.remove();

            const submitPost = (type) => {
              const content = document.getElementById('fb-coll-content').value;
              const url = document.getElementById('fb-coll-url').value;
              const images = document.getElementById('fb-coll-images').value;
              const statusDiv = document.getElementById('fb-coll-status');

              if (!content.trim()) {
                statusDiv.textContent = 'Vui lòng nhập nội dung!';
                statusDiv.style.color = 'red';
                return;
              }

              statusDiv.textContent = 'Đang lưu...';
              statusDiv.style.color = '#666';

              const form = document.createElement('form');
              form.method = 'POST';
              form.action = 'https://vietnam-expat-support.vercel.app/api/collect-post-form';
              form.target = 'fb-collector-popup';
              form.style.display = 'none';

              const typeInput = document.createElement('input');
              typeInput.type = 'hidden';
              typeInput.name = 'type';
              typeInput.value = type;
              form.appendChild(typeInput);

              const contentInput = document.createElement('input');
              contentInput.type = 'hidden';
              contentInput.name = 'content';
              contentInput.value = content;
              form.appendChild(contentInput);

              const urlInput = document.createElement('input');
              urlInput.type = 'hidden';
              urlInput.name = 'url';
              urlInput.value = url;
              form.appendChild(urlInput);

              const imagesInput = document.createElement('input');
              imagesInput.type = 'hidden';
              imagesInput.name = 'images';
              imagesInput.value = images;
              form.appendChild(imagesInput);

              document.body.appendChild(form);
              window.open('', 'fb-collector-popup', 'width=500,height=400,scrollbars=yes');
              form.submit();
              document.body.removeChild(form);

              statusDiv.textContent = 'Đang mở cửa sổ lưu...';
              statusDiv.style.color = 'green';
              setTimeout(() => overlay.remove(), 1000);
            };

            document.getElementById('fb-coll-khach').onclick = () => submitPost('khach');
            document.getElementById('fb-coll-nha').onclick = () => submitPost('nha');
        } catch(e) {
            alert("Lỗi phần mềm: " + e.message);
        }
      })();
`;
const code = 'javascript:' + encodeURIComponent(rawScript.replace(/\s+/g, ' ').trim());
console.log(code);

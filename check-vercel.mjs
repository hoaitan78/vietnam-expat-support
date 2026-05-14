fetch('https://vietnam-expat-support.vercel.app/tools/facebook-collector')
  .then(res => res.text())
  .then(html => {
    if (html.includes('Nếu vẫn không tìm thấy ảnh')) {
      console.log("Vercel is still serving the OLD cached page with the comment!");
    } else {
      console.log("Vercel is serving the NEW page.");
    }
  })
  .catch(console.error);

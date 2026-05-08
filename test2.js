const rawScript = `
      (function() {
        if (document.getElementById('fb-collector-overlay')) {
          return;
        }

        const selectedText = "dummy";
        const currentUrl = "dummy";
        const origin = "dummy";

        const overlay = document.createElement('div');
        overlay.innerHTML = \`
          <textarea>\${selectedText}</textarea>
        \`;
      })();
    `;

console.log(rawScript);
const encoded = 'javascript:' + encodeURIComponent(rawScript.replace(/\s+/g, ' ').trim());
console.log(encoded);

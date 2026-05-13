const regex1 = /(?:0|\+84)[ \-\.]?[35789](?:[ \-\.]?\d){8}\b/g;
console.log('regex1 0905062303:', '0905062303'.match(regex1));
console.log('regex1 0852.582.076:', '0852.582.076'.match(regex1));
console.log('regex1 0862116979:', '0862116979'.match(regex1));
console.log('regex1 0386715274:', '0386715274'.match(regex1));

const text = `WhatsApp/Zalo: 0905062303 — Như Ý Gohome
Lh: 0852.582.076 Ẩn bớt
0862116979 Liên hệ trực tiếp qua Kakaotalk, Zalo, Telegram, WhatsApp
Zalo/Call: 0386715274 (Mr Hoàng)
`;
console.log('text match:', text.match(regex1));

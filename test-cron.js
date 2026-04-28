require('dotenv').config({ path: '.env.local' });

async function test() {
  const { getApprovedPostForToday } = await import('./services/googleSheets.js');
  try {
    const post = await getApprovedPostForToday();
    console.log("Approved post:", post);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();

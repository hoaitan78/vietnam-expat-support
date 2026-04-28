require('dotenv').config({ path: '.env.local' });

async function testFb() {
  const { publishPostToFacebook } = await import('./services/facebook.js');
  const content = "Test auto post from Node JS. This is a test.";
  const imageUrl = "https://image.pollinations.ai/prompt/A%20street%20scene?width=1200&height=630&nologo=true";

  try {
    console.log("Publishing...");
    const result = await publishPostToFacebook(content, imageUrl);
    console.log("Result:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

testFb();

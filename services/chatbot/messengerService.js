export const sendMessengerMessage = async (recipientId, text) => {
  const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
  if (!PAGE_ACCESS_TOKEN) {
    console.error("MESSENGER_PAGE_ACCESS_TOKEN is not set.");
    return;
  }

  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  
  const payload = {
    recipient: { id: recipientId },
    message: { text }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Error sending Messenger message:", data);
    } else {
        console.log("Messenger message sent successfully:", data);
    }
  } catch (error) {
    console.error("Failed to send Messenger message:", error);
  }
};

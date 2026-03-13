export const sendWhatsAppMessage = async (recipientPhone, text) => {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials are not set.");
    return;
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "text",
    text: { body: text }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Error sending WhatsApp message:", data);
    } else {
        console.log("WhatsApp message sent successfully:", data);
    }
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
};

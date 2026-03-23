import { NextResponse } from 'next/server';
import { sendMessengerMessage } from '../../../services/chatbot/messengerService';
import { sendWhatsAppMessage } from '../../../services/chatbot/whatsappService';
import { generateBotResponse } from '../../../services/chatbot/aiHandler';

// Handle Webhook Verification Request
export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 }); // Meta requires exactly the challenge string
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Bad Request', { status: 400 });
}

// Handle Incoming Messages
export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Messenger Handling
    if (body.object === 'page') {
      for (const entry of body.entry) {
        // Facebook can batch events, although typically it's 1 event
        if (entry.messaging && entry.messaging.length > 0) {
            const webhook_event = entry.messaging[0];
            console.log("Messenger Event Received");

            const sender_psid = webhook_event.sender.id;

            if (webhook_event.message && webhook_event.message.text) {
              const userMessage = webhook_event.message.text;
              const replyText = await generateBotResponse(userMessage);

              await sendMessengerMessage(sender_psid, replyText);
            }
        }
      }
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    // 2. WhatsApp Handling
    if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry) {
            for(const change of entry.changes) {
                const value = change.value;
                if (value.messages && value.messages.length > 0) {
                    const message = value.messages[0];
                    console.log("WhatsApp Event Received");
                    
                    const senderPhone = message.from;
                    if (message.type === 'text') {
                        const userMessage = message.text.body;
                        const replyText = await generateBotResponse(userMessage);
                        
                        await sendWhatsAppMessage(senderPhone, replyText);
                    }
                }
            }
        }
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }

    return new NextResponse('Not Found', { status: 404 });

  } catch (error) {
    console.error("Webhook POST Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendWhatsAppMessage(to: string, body: string) {
  if (!to || !body) return;

  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body,
    });
    console.log('WhatsApp message sent:', message.sid);
    return message;
  } catch (error) {
    console.error('WhatsApp send failed:', error);
  }
}
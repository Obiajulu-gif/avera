// lib/whatsapp/constants.js
export const WHATSAPP_CONFIG = {
  phoneNumberId: process.env.WA_PHONE_NUMBER_ID,
  accessToken: process.env.CLOUD_API_ACCESS_TOKEN,
  apiVersion: process.env.CLOUD_API_VERSION || "v21.0",
  businessAccountId: process.env.WA_BUSINESS_ACCOUNT_ID,
  webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
};

export const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${WHATSAPP_CONFIG.apiVersion}`;

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  AUDIO: "audio",
  TEMPLATE: "template",
  INTERACTIVE: "interactive",
};

export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
};

// Validate configuration
export const validateConfig = () => {
  const required = ["phoneNumberId", "accessToken"];

  const missing = required.filter((key) => !WHATSAPP_CONFIG[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required WhatsApp configuration: ${missing.join(", ")}`
    );
  }

  return true;
};

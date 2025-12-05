// lib/whatsapp/utils.js

/**
 * Format phone number to WhatsApp format
 * Removes +, spaces, hyphens, and parentheses
 */
export const formatPhoneNumber = async (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-numeric characters
  return phoneNumber.replace(/[^\d]/g, "");
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phoneNumber) => {
  const formatted = formatPhoneNumber(phoneNumber);

  // Should be between 10-15 digits
  return /^\d{10,15}$/.test(formatted);
};

/**
 * Parse incoming webhook message
 */
export const parseWebhookMessage = (body) => {
  try {
    if (body.object !== "whatsapp_business_account") {
      return null;
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) return null;

    // Parse messages
    if (value.messages && value.messages.length > 0) {
      const message = value.messages[0];

      return {
        type: "message",
        from: message.from,
        messageId: message.id,
        timestamp: message.timestamp,
        messageType: message.type,
        message: parseMessageContent(message),
        contact: value.contacts?.[0],
        metadata: value.metadata,
      };
    }

    // Parse status updates
    if (value.statuses && value.statuses.length > 0) {
      const status = value.statuses[0];

      return {
        type: "status",
        messageId: status.id,
        status: status.status,
        timestamp: status.timestamp,
        recipientId: status.recipient_id,
        errors: status.errors,
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing webhook:", error);
    return null;
  }
};

/**
 * Parse message content based on type
 */
const parseMessageContent = (message) => {
  const { type } = message;

  switch (type) {
    case "text":
      return {
        text: message.text?.body,
      };

    case "image":
      return {
        id: message.image?.id,
        mimeType: message.image?.mime_type,
        caption: message.image?.caption,
        sha256: message.image?.sha256,
      };

    case "video":
      return {
        id: message.video?.id,
        mimeType: message.video?.mime_type,
        caption: message.video?.caption,
        sha256: message.video?.sha256,
      };

    case "document":
      return {
        id: message.document?.id,
        filename: message.document?.filename,
        mimeType: message.document?.mime_type,
        caption: message.document?.caption,
        sha256: message.document?.sha256,
      };

    case "audio":
      return {
        id: message.audio?.id,
        mimeType: message.audio?.mime_type,
        sha256: message.audio?.sha256,
      };

    case "location":
      return {
        latitude: message.location?.latitude,
        longitude: message.location?.longitude,
        name: message.location?.name,
        address: message.location?.address,
      };

    case "interactive":
      if (message.interactive?.type === "button_reply") {
        return {
          buttonId: message.interactive.button_reply?.id,
          buttonTitle: message.interactive.button_reply?.title,
        };
      }
      if (message.interactive?.type === "list_reply") {
        return {
          listId: message.interactive.list_reply?.id,
          listTitle: message.interactive.list_reply?.title,
          listDescription: message.interactive.list_reply?.description,
        };
      }
      return { interactive: message.interactive };

    case "button":
      return {
        buttonText: message.button?.text,
        buttonPayload: message.button?.payload,
      };

    default:
      return { raw: message };
  }
};

/**
 * Create success response
 */
export const successResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Create error response
 */
export const errorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    error: typeof error === "string" ? error : error.message,
    statusCode,
  };
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length > 0) {
    return {
      isValid: false,
      missing,
      message: `Missing required fields: ${missing.join(", ")}`,
    };
  }

  return { isValid: true };
};

/**
 * Sleep utility for rate limiting
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// lib/whatsapp/client.js
import axios from "axios";
import {
  WHATSAPP_CONFIG,
  WHATSAPP_API_BASE_URL,
  MESSAGE_TYPES,
} from "./constants";

class WhatsAppClient {
  constructor() {
    this.phoneNumberId = WHATSAPP_CONFIG.phoneNumberId;
    this.accessToken = WHATSAPP_CONFIG.accessToken;
    this.baseURL = `${WHATSAPP_API_BASE_URL}/${this.phoneNumberId}`;
  }

  /**
   * Make API request to WhatsApp
   */
  async makeRequest(endpoint, data) {
    try {
      const response = await axios({
        method: "POST",
        url: `${this.baseURL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        data,
      });

      return {
        success: true,
        data: response.data,
        messageId: response.data.messages?.[0]?.id,
      };
    } catch (error) {
      console.error(
        "WhatsApp API Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.response?.data?.error || {
          message: error.message,
          type: "unknown_error",
        },
      };
    }
  }

  /**
   * Send text message
   */
  async sendTextMessage(to, text) {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: MESSAGE_TYPES.TEXT,
      text: {
        preview_url: true,
        body: text,
      },
    };

    return this.makeRequest("/messages", data);
  }

  /**
   * Send template message
   */
  async sendTemplate(
    to,
    templateName,
    languageCode = "en_US",
    components = []
  ) {
    const data = {
      messaging_product: "whatsapp",
      to: to,
      type: MESSAGE_TYPES.TEMPLATE,
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
      },
    };

    if (components.length > 0) {
      data.template.components = components;
    }

    return this.makeRequest("/messages", data);
  }

  /**
   * Send media message (image, video, document, audio)
   */
  async sendMedia(to, mediaType, mediaUrl, caption = "", filename = "") {
    const mediaObject = {
      link: mediaUrl,
    };

    // Add caption for image and video
    if (
      caption &&
      (mediaType === MESSAGE_TYPES.IMAGE || mediaType === MESSAGE_TYPES.VIDEO)
    ) {
      mediaObject.caption = caption;
    }

    // Add filename for documents
    if (filename && mediaType === MESSAGE_TYPES.DOCUMENT) {
      mediaObject.filename = filename;
    }

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: mediaType,
      [mediaType]: mediaObject,
    };

    return this.makeRequest("/messages", data);
  }

  /**
   * Send image
   */
  async sendImage(to, imageUrl, caption = "") {
    return this.sendMedia(to, MESSAGE_TYPES.IMAGE, imageUrl, caption);
  }

  /**
   * Send document
   */
  async sendDocument(to, documentUrl, filename = "", caption = "") {
    return this.sendMedia(
      to,
      MESSAGE_TYPES.DOCUMENT,
      documentUrl,
      caption,
      filename
    );
  }

  /**
   * Send video
   */
  async sendVideo(to, videoUrl, caption = "") {
    return this.sendMedia(to, MESSAGE_TYPES.VIDEO, videoUrl, caption);
  }

  /**
   * Send interactive buttons
   */
  async sendButtons(to, bodyText, buttons, headerText = "", footerText = "") {
    const interactive = {
      type: "button",
      body: {
        text: bodyText,
      },
      action: {
        buttons: buttons.map((btn, index) => ({
          type: "reply",
          reply: {
            id: btn.id || `btn_${index}`,
            title: btn.title,
          },
        })),
      },
    };

    if (headerText) {
      interactive.header = {
        type: "text",
        text: headerText,
      };
    }

    if (footerText) {
      interactive.footer = {
        text: footerText,
      };
    }

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: MESSAGE_TYPES.INTERACTIVE,
      interactive,
    };

    return this.makeRequest("/messages", data);
  }

  /**
   * Send interactive list
   */
  async sendList(
    to,
    bodyText,
    buttonText,
    sections,
    headerText = "",
    footerText = ""
  ) {
    const interactive = {
      type: "list",
      body: {
        text: bodyText,
      },
      action: {
        button: buttonText,
        sections: sections,
      },
    };

    if (headerText) {
      interactive.header = {
        type: "text",
        text: headerText,
      };
    }

    if (footerText) {
      interactive.footer = {
        text: footerText,
      };
    }

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: MESSAGE_TYPES.INTERACTIVE,
      interactive,
    };

    return this.makeRequest("/messages", data);
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    return this.makeRequest("/messages", data);
  }

  /**
   * Get media URL from media ID
   */
  async getMediaUrl(mediaId) {
    try {
      const response = await axios({
        method: "GET",
        url: `${WHATSAPP_API_BASE_URL}/${mediaId}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return {
        success: true,
        url: response.data.url,
        mimeType: response.data.mime_type,
        fileSize: response.data.file_size,
      };
    } catch (error) {
      console.error(
        "Error getting media URL:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }
}

// Export singleton instance
const whatsappClient = new WhatsAppClient();
export default whatsappClient;

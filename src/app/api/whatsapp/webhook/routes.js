// app/api/whatsapp/webhook/route.js
import { NextResponse } from "next/server";
import whatsappClient from "@/lib/whatsapp/client";
import { WHATSAPP_CONFIG } from "@/lib/whatsapp/constants";
import { parseWebhookMessage } from "@/lib/whatsapp/utils";

/**
 * GET - Webhook Verification
 * Meta will call this endpoint to verify your webhook
 */
export const GET = async (request) => {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Check if the mode and token sent are correct
  if (mode === "subscribe" && token === WHATSAPP_CONFIG.webhookVerifyToken) {
    console.log("✅ Webhook verified successfully!");

    // Respond with challenge token from the request
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.log("❌ Webhook verification failed");
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
};

/**
 * POST - Receive Messages
 * Meta sends incoming messages to this endpoint
 */
export const POST = async (request) => {
  try {
    const body = await request.json();

    console.log("📨 Webhook received:", JSON.stringify(body, null, 2));

    // Respond quickly to acknowledge receipt (required by Meta)
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Process webhook asynchronously
    processWebhook(body).catch((error) => {
      console.error("Error processing webhook:", error);
    });

    return response;
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

/**
 * Process webhook data asynchronously
 */
const processWebhook = async (body) => {
  const data = parseWebhookMessage(body);

  if (!data) {
    console.log("No valid data in webhook");
    return;
  }

  console.log("Parsed webhook data:", data);

  if (data.type === "message") {
    await handleIncomingMessage(data);
  } else if (data.type === "status") {
    await handleStatusUpdate(data);
  }
};

/**
 * Handle incoming messages
 */
const handleIncomingMessage = async (data) => {
  const { from, messageId, messageType, message } = data;

  console.log(`📩 New ${messageType} message from ${from}`);

  // Mark message as read
  await whatsappClient.markAsRead(messageId);

  // Handle different message types
  switch (messageType) {
    case "text":
      await handleTextMessage(from, message.text, messageId);
      break;

    case "image":
      console.log("Image received:", message);
      await whatsappClient.sendTextMessage(from, "📷 Thanks for the image!");
      break;

    case "video":
      console.log("Video received:", message);
      await whatsappClient.sendTextMessage(from, "🎥 Video received!");
      break;

    case "document":
      console.log("Document received:", message);
      await whatsappClient.sendTextMessage(from, "📄 Document received!");
      break;

    case "audio":
      console.log("Audio received:", message);
      await whatsappClient.sendTextMessage(from, "🎵 Audio received!");
      break;

    case "location":
      console.log("Location received:", message);
      await whatsappClient.sendTextMessage(
        from,
        `📍 Location received: ${message.latitude}, ${message.longitude}`
      );
      break;

    case "interactive":
      console.log("Interactive message received:", message);
      if (message.buttonId) {
        await whatsappClient.sendTextMessage(
          from,
          `You clicked: ${message.buttonTitle}`
        );
      }
      break;

    default:
      console.log("Unknown message type:", messageType);
  }
};

/**
 * Handle text messages with simple commands
 */
const handleTextMessage = async (from, text, messageId) => {
  const lowerText = text.toLowerCase().trim();

  console.log(`Message: "${text}"`);

  let reply = "";

  // Simple command processing
  if (lowerText.includes("hello") || lowerText.includes("hi")) {
    reply = "👋 Hello! How can I help you today?";
  } else if (lowerText.includes("help")) {
    reply = `🤖 *Available Commands:*

• Send "hello" - Get a greeting
• Send "time" - Get current time
• Send "help" - Show this message
• Send "menu" - Show interactive menu
• Send anything else - Echo response`;
  } else if (lowerText.includes("time")) {
    const now = new Date();
    reply = `🕐 Current time: ${now.toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "long",
    })}`;
  } else if (lowerText.includes("menu")) {
    // Send interactive buttons
    await whatsappClient.sendButtons(
      from,
      "Please choose an option:",
      [
        { id: "option_1", title: "📊 View Stats" },
        { id: "option_2", title: "❓ Get Help" },
        { id: "option_3", title: "📞 Contact Us" },
      ],
      "🤖 Main Menu",
      "Powered by WhatsApp API"
    );
    return;
  } else {
    reply = `You said: "${text}"\n\nType *help* to see available commands.`;
  }

  // Send reply
  await whatsappClient.sendTextMessage(from, reply);
};

/**
 * Handle message status updates
 */
const handleStatusUpdate = (data) => {
  const { messageId, status, recipientId } = data;

  console.log(
    `📊 Message ${messageId} status: ${status} (recipient: ${recipientId})`
  );

  // You can store status updates in a database here
  // For example: update message delivery status in your DB
};

// Export for webhook testing
export const dynamic = "force-dynamic";

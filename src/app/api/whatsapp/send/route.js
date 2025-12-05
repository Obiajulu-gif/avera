// app/api/whatsapp/send/route.js
import { NextResponse } from "next/server";
import whatsappClient from "@/lib/whatsapp/client";
import {
  formatPhoneNumber,
  isValidPhoneNumber,
  validateRequiredFields,
  successResponse,
  errorResponse,
} from "@/lib/whatsapp/utils";

export const POST = async (request) => {
  try {
    const body = await request.json();

    // Validate required fields
    const validation = validateRequiredFields(body, ["to", "message"]);
    if (!validation.isValid) {
      return NextResponse.json(errorResponse(validation.message, 400), {
        status: 400,
      });
    }

    const { to, message, type = "text" } = body;

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(to);
    if (!isValidPhoneNumber(formattedPhone)) {
      return NextResponse.json(
        errorResponse(
          "Invalid phone number format. Use international format (e.g., 14155551234)",
          400
        ),
        { status: 400 }
      );
    }

    // Send message based on type
    let result;

    if (type === "text") {
      result = await whatsappClient.sendTextMessage(formattedPhone, message);
    } else {
      return NextResponse.json(
        errorResponse(
          "Unsupported message type. Use /api/whatsapp/media for media messages.",
          400
        ),
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error, 500), {
        status: 500,
      });
    }

    return NextResponse.json(
      successResponse(
        {
          messageId: result.messageId,
          to: formattedPhone,
        },
        "Message sent successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(errorResponse(error.message, 500), {
      status: 500,
    });
  }
};

// Handle OPTIONS for CORS
export const OPTIONS = async (request) => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

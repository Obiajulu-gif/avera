// app/api/whatsapp/media/route.js
import { NextResponse } from "next/server";
import whatsappClient from "@/lib/whatsapp/client";
import { MESSAGE_TYPES } from "@/lib/whatsapp/constants";
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
    const validation = validateRequiredFields(body, [
      "to",
      "mediaUrl",
      "mediaType",
    ]);
    if (!validation.isValid) {
      return NextResponse.json(errorResponse(validation.message, 400), {
        status: 400,
      });
    }

    const { to, mediaUrl, mediaType, caption = "", filename = "" } = body;

    // Validate media type
    const validMediaTypes = [
      MESSAGE_TYPES.IMAGE,
      MESSAGE_TYPES.VIDEO,
      MESSAGE_TYPES.DOCUMENT,
      MESSAGE_TYPES.AUDIO,
    ];

    if (!validMediaTypes.includes(mediaType)) {
      return NextResponse.json(
        errorResponse(
          `Invalid media type. Must be one of: ${validMediaTypes.join(", ")}`,
          400
        ),
        { status: 400 }
      );
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(to);
    if (!isValidPhoneNumber(formattedPhone)) {
      return NextResponse.json(
        errorResponse("Invalid phone number format", 400),
        { status: 400 }
      );
    }

    // Send media message
    const result = await whatsappClient.sendMedia(
      formattedPhone,
      mediaType,
      mediaUrl,
      caption,
      filename
    );

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
          mediaType,
        },
        "Media sent successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Send media error:", error);
    return NextResponse.json(errorResponse(error.message, 500), {
      status: 500,
    });
  }
};

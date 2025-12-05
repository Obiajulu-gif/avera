// app/api/whatsapp/template/route.js
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
    const validation = validateRequiredFields(body, ["to", "templateName"]);
    if (!validation.isValid) {
      return NextResponse.json(errorResponse(validation.message, 400), {
        status: 400,
      });
    }

    const { to, templateName, languageCode = "en_US", components = [] } = body;

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(to);
    if (!isValidPhoneNumber(formattedPhone)) {
      return NextResponse.json(
        errorResponse("Invalid phone number format", 400),
        { status: 400 }
      );
    }

    // Send template message
    const result = await whatsappClient.sendTemplate(
      formattedPhone,
      templateName,
      languageCode,
      components
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
          templateName,
        },
        "Template sent successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Send template error:", error);
    return NextResponse.json(errorResponse(error.message, 500), {
      status: 500,
    });
  }
};

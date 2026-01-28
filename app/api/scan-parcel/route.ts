import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Call Groq AI with the image
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this parcel/package image and extract ALL visible information. Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "toAddress": {
    "name": "recipient name if visible",
    "address": "street address",
    "city": "city name",
    "state": "state name",
    "pincode": "postal/zip code",
    "phone": "phone number if visible"
  },
  "fromAddress": {
    "name": "sender name if visible",
    "address": "sender street address",
    "city": "sender city",
    "state": "sender state",
    "pincode": "sender postal code",
    "phone": "sender phone if visible"
  },
  "courierDetails": {
    "weight": "weight if visible (with unit)",
    "length": "length dimension if visible",
    "width": "width dimension if visible",
    "height": "height dimension if visible",
    "description": "brief description of contents if visible",
    "trackingId": "tracking number if visible",
    "waybill": "waybill/AWB number if visible",
    "quantity": "quantity/number of items"
  },
  "trackingId": "tracking ID if visible",
  "waybill": "waybill number if visible",
  "quantity": "quantity if visible",
  "pincode": "destination pincode if visible"
}

Extract as much information as possible. Use empty strings ("") for fields that are not visible or cannot be determined. Focus on labels like "To:", "From:", "Ship to:", "Return address:", "Tracking:", "Weight:", etc.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the AI response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Return a default structure if parsing fails
      parsedData = {
        toAddress: {
          name: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
        },
        fromAddress: {
          name: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
        },
        courierDetails: {
          weight: "",
          length: "",
          width: "",
          height: "",
          description: "",
          trackingId: "",
          waybill: "",
          quantity: "",
        },
      };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

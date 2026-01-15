import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Connect to Upstash
const redis = new Redis({
  url: "https://meet-hermit-35370.upstash.io",
  token: "AYoqAAIncDEwYWVjMDFmNDIxMjM0N2Y4OTRkMzkwODBhNDdjNzRhYnAxMzUzNzA",
});

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    // Validate input exists
    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Invalid request: input is required" },
        { status: 400 }
      );
    }

    const shortCode = input.trim().toUpperCase();

    // Validate format
    if (!isValidShortCode(shortCode)) {
      return NextResponse.json(
        {
          error: "Invalid tracking number format",
          expected: "Format: 1 letter (A-Z) + 10 digits (e.g., A0000000001)",
          received: shortCode,
        },
        { status: 400 }
      );
    }

    // Direct lookup from Redis
    const original = await redis.get<string>(`decode:${shortCode}`);

    if (!original) {
      return NextResponse.json(
        {
          error: "Tracking number not found",
          shortCode: shortCode,
          message:
            "This short code has not been generated yet or does not exist",
        },
        { status: 404 }
      );
    }

    // Verify reverse mapping exists (data integrity check)
    const reverseCheck = await redis.get<string>(`track:${original}`);
    if (reverseCheck !== shortCode) {
      console.error(
        `DATA INTEGRITY ERROR: decode:${shortCode} → ${original}, but track:${original} → ${reverseCheck}`
      );

      return NextResponse.json(
        {
          error: "Data integrity issue detected",
          shortCode: shortCode,
          decoded: original,
          warning: "Please contact support with this tracking number",
        },
        { status: 500 }
      );
    }

    const decoded = {
      trackingNo: shortCode,
      original: original,
      prefix: shortCode.charAt(0),
      number: shortCode.substring(1),
      cycle: Math.floor(
        (parseInt(shortCode.substring(1)) + 1) / 10_000_000_000
      ),
    };

    return NextResponse.json({
      success: true,
      decoded: original,
      details: decoded,
    });
  } catch (error: any) {
    console.error("Decode error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Failed to decode tracking number",
      },
      { status: 500 }
    );
  }
}
/**
 * Validate short tracking code format
 */
function isValidShortCode(code: string): boolean {
  // Must be exactly 11 characters
  if (code.length !== 11) return false;

  // First character must be A-Z
  const firstChar = code.charCodeAt(0);
  if (firstChar < 65 || firstChar > 90) return false;

  // Remaining 10 characters must be digits
  const numericPart = code.substring(1);
  if (!/^\d{10}$/.test(numericPart)) return false;

  return true;
}

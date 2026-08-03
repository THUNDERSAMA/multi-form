import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let limit = searchParams.get("limit") || "12";
    const offset = searchParams.get("offset") || "0";
    const status = searchParams.get("status") || "";
    const searchtype = searchParams.get("searchtype") || "";
    const name = searchParams.get("name") || "";
    const fromdate = searchParams.get("fromdate") || "";
    const todate = searchParams.get("todate") || "";

    if (searchtype != "") {
      limit = "10000"; // Set limit to 1000 if searchtype is empty
    }
    // Build the backend URL - adjust this to match your PHP backend URL
    const backendParams = new URLSearchParams({
      limit,
      offset,
    });

    if (status) backendParams.set("status", status);
    if (searchtype) backendParams.set("searchtype", searchtype);
    if (name) backendParams.set("name", name);
    if (fromdate) backendParams.set("fromdate", fromdate);
    if (todate) backendParams.set("todate", todate);

    const url = `https://courierwallah.in/api/getData.php?${backendParams.toString()}`;

    console.log("Fetching from:", url);

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching for now
    });

    // Get the raw response text
    const rawText = await resp.text();
    console.log("Raw response:", rawText.substring(0, 200)); // Log first 200 chars

    // Check if response looks like HTML (error page)
    if (
      rawText.trim().startsWith("<!DOCTYPE") ||
      rawText.trim().startsWith("<")
    ) {
      console.error(
        "Received HTML instead of JSON:",
        rawText.substring(0, 500),
      );
      return NextResponse.json(
        {
          error: "Backend returned HTML instead of JSON. Check PHP errors.",
          data: [],
          pagination: {
            total: 0,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: false,
            currentCount: 0,
          },
        },
        { status: 500 },
      );
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw text that failed to parse:", rawText);
      return NextResponse.json(
        {
          error: "Failed to parse backend response as JSON",
          data: [],
          pagination: {
            total: 0,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: false,
            currentCount: 0,
          },
        },
        { status: 500 },
      );
    }

    // Check if the old format (array) or new format (object with data/pagination)
    if (Array.isArray(data)) {
      // Old format - convert to new format
      console.log("Converting old format to new format");
      return NextResponse.json({
        data: data,
        pagination: {
          total: data.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: false,
          currentCount: data.length,
        },
      });
    } else if (data.data && data.pagination) {
      // New format - return as is
      return NextResponse.json(data);
    } else {
      // Unknown format
      return NextResponse.json(
        {
          error: "Unknown data format from backend",
          data: [],
          pagination: {
            total: 0,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: false,
            currentCount: 0,
          },
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in getData API route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
        pagination: {
          total: 0,
          limit: 12,
          offset: 0,
          hasMore: false,
          currentCount: 0,
        },
      },
      { status: 500 },
    );
  }
}

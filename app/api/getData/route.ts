// import { NextResponse, NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   const searchParams = req.nextUrl.searchParams;

//   const limit = searchParams.get("limit") || "12";
//   const offset = searchParams.get("offset") || "0";
//   //console.log("FORM DATA JSON:", formDataJson);
//   const resp = await fetch(
//     `https://courierwallah.in/api/getData.php?limit=${limit}&offset=${offset}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log(
//     "STATUS:",
//     resp.status,
//     "\nCONTENT TYPE:",
//     resp.headers.get("content-type")
//   );
//   const rawText = await resp.text();
//   // console.log("raw response:",rawText);
//   const data = JSON.parse(rawText);
//   return NextResponse.json({ data });
// }
// app/api/getData/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "12";
    const offset = searchParams.get("offset") || "0";
    const status = searchParams.get("status") || "";

    // Build the backend URL - adjust this to match your PHP backend URL
    const url = `https://courierwallah.in/api/getData.php?limit=${limit}&offset=${offset}${
      status ? `&status=${status}` : ""
    }`;

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
        rawText.substring(0, 500)
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
        { status: 500 }
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
        { status: 500 }
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
      // console.error("Unknown data format:", data);
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
        { status: 500 }
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
      { status: 500 }
    );
  }
}

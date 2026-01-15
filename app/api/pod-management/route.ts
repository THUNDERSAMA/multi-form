import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    switch (action) {
      case "getCouriers": {
        const response = await fetch(
          `https://courierwallah.in/api/pod-management-api.php?action=getCouriers`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getPodRanges": {
        const response = await fetch(
          `https://courierwallah.in/api/pod-management-api.php?action=getPodRanges`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getAvailablePods": {
        const courierId = searchParams.get("courierId");
        const response = await fetch(
          `https://courierwallah.in/api/pod-management-api.php?action=getAvailablePods&courierId=${courierId}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "searchPod": {
        const podNumber = searchParams.get("podNumber");
        const courierId = searchParams.get("courierId");
        const response = await fetch(
          `https://courierwallah.in/api/pod-management-api.php?action=searchPod&podNumber=${podNumber}&courierId=${courierId}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const response = await fetch(
      `https://courierwallah.in/api/pod-management-api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

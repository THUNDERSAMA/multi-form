import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  try {
    const apiUrl = "https://courierwallah.in/api/";

    switch (action) {
      case "getRecentDeliveries": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getRecentDeliveries`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getTopDestinations": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getTopDestinations`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getTotalDeliveries": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getTotalDeliveries`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getActiveShipments": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getActiveShipments`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getTodayBookings": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getTodayBookings`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getDailyDeliveries": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getDailyDeliveries`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getWeeklyDeliveries": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getWeeklyDeliveries`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getMonthlyDeliveries": {
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getMonthlyDeliveries`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      }

      case "getDashboardStats": {
        // Get all stats in one call for efficiency
        const response = await fetch(
          `${apiUrl}/dashboard-api.php?action=getDashboardStats`,
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
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

// GET: Fetch current POD data
export async function GET() {
  try {
    // Call PHP API to get POD data
    const response = await fetch(
      `https://courierwallah.in/api/pod-api.php?action=get`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch POD data from PHP API");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch POD data");
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          available: data.available || 0,
          totalIssued: data.totalIssued || 0,
          totalReturned: data.totalReturned || 0,
          lastUpdated: data.lastUpdated || "N/A",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching POD data:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST: Update POD quantity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, quantity, updatedBy, comments } = body;

    // Validation
    if (!action || !["increment", "decrement"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Must be 'increment' or 'decrement'",
        },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (!updatedBy || !updatedBy.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Updated by field is required",
        },
        { status: 400 }
      );
    }

    // Call PHP API to update POD
    const response = await fetch(`https://courierwallah.in/api/pod-api.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        quantity: parseInt(quantity),
        updatedBy: updatedBy.trim(),
        comments: comments ? comments.trim() : null,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update POD quantity in PHP API");
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update POD quantity",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message || "POD quantity updated successfully",
        data: {
          newAvailable: data.newAvailable || 0,
          action,
          quantity,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating POD quantity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

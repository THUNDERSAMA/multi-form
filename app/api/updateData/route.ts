import { NextResponse } from "next/server";

async function cancelParcel(id : string) {
    // Function to cancel the parcel
    const resp = await fetch('https://courierwallah.in/api/updatestatus.php', {
        method: 'POST',
        body: JSON.stringify({ id, status: "cancel" }),
        headers: {
            "Content-Type": "application/json",
          },
    });
    if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
      if (resp.status !== 200) {
        throw new Error('Invalid credentials');
      }
      return {"status": "success"};
}
async function confirmParcel(id : string) {
    // Function to confirm the parcel
    const resp = await fetch('https://courierwallah.in/api/updatestatus.php', {
        method: 'POST',
        body: JSON.stringify({ id, status: "confirm" }),
        headers: {
            "Content-Type": "application/json",
          },
    });
    if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
      if (resp.status !== 200) {
        throw new Error('Invalid credentials');
      }
      return {"status": "success"};
}
async function deliveredParcel(id : string) {
    // Function to confirm the parcel
    const resp = await fetch('https://courierwallah.in/api/updatestatus.php', {
        method: 'POST',
        body: JSON.stringify({ id, status: "delivered" }),
        headers: {
            "Content-Type": "application/json",
          },
    });
    if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
      if (resp.status !== 200) {
        throw new Error('Invalid credentials');
      }
      return {"status": "success"};
}
async function notdeliveredParcel(id : string) {
    // Function to confirm the parcel
    const resp = await fetch('https://courierwallah.in/api/updatestatus.php', {
        method: 'POST',
        body: JSON.stringify({ id, status: "not-delivered" }),
        headers: {
            "Content-Type": "application/json",
          },
    });
    if (!resp.ok) {
        throw new Error('Network response was not ok');
      }
      if (resp.status !== 200) {
        throw new Error('Invalid credentials');
      }
      return {"status": "success"};
}
export async function POST(req: Request) {
     const {id,status}  = await req.json();
    //console.log("FORM DATA JSON:", formDataJson);
     if(status=="cancel") {
        const data = await cancelParcel(id);
        console.log("DATA:", data);
            return NextResponse.json({ data })
     }
        if(status=="confirm") {
            const data = await confirmParcel(id);
            console.log("DATA:", data);
                return NextResponse.json({ data })
        }
        if(status=="delivered") {
            const data = await deliveredParcel(id);
            console.log("DATA:", data);
                return NextResponse.json({ data })
        }
        if(status=="not-delivered") {
            const data = await notdeliveredParcel(id);
            console.log("DATA:", data);
                return NextResponse.json({ data })
        }


    
}
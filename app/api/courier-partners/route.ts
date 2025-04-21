import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { pincode,type} = await req.json();
    const body = new FormData();
    body.set("pincode", pincode);
    body.set("type", type);
    console.log("FORM DATA JSON:", pincode,type);
    const resp = await fetch('https://courierwallah.in/api/checkAvailable.php', {
        body,
        method: 'POST',
       
    });
  
          console.log(
            "STATUS:",
            resp.status,
            "\nCONTENT TYPE:",
            resp.headers.get("content-type"),
          );
          const rawText = await resp.text();
         console.log("raw response:",rawText);
            const data =JSON.parse(rawText);
            return NextResponse.json({ data })


    
}
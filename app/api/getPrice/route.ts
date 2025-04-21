import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { pincode,type,weight,length,width,height,quantity,courier} = await req.json();
    const body = new FormData();
    body.set("pincode", pincode);
    body.set("type", type);
    body.set("weight", weight);
    body.set("length", length);
    body.set("width", width);
    body.set("height", height);
    body.set("quantity", quantity);
    body.set("courier",courier)

    console.log("FORM DATA JSON:", pincode,type,weight,length,width,height,quantity,courier);
    const resp = await fetch('https://courierwallah.in/api/checkPrice.php', {
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
import { NextResponse } from "next/server";

export async function GET(req: Request) {
     
    //console.log("FORM DATA JSON:", formDataJson);
    const resp = await fetch('https://courierwallah.in/api/getData.php', {
        headers: {
            "Content-Type": "application/json",
          },
    });
  
          console.log(
            "STATUS:",
            resp.status,
            "\nCONTENT TYPE:",
            resp.headers.get("content-type"),
          );
          const rawText = await resp.text();
         // console.log("raw response:",rawText);
            const data =JSON.parse(rawText);
            return NextResponse.json({ data })


    
}
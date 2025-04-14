import { NextResponse } from "next/server";

export async function POST(req: Request) {
     const formDataJson  = await req.json();
    //console.log("FORM DATA JSON:", formDataJson);
    const resp = await fetch('https://courierwallah.in/api/submit.php', {
        method: 'POST',
        body: formDataJson,
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
          console.log(
            "STATUS:",
            resp.status,
            "\nCONTENT TYPE:",
            resp.headers.get("content-type"),
          );
          const data =JSON.parse(await resp.text());
            console.log("DATA:", data);
            if(data.status=="error") { 
              return NextResponse.json(
                { message: 'not submitted' },
                {
                  status: 401,
                },
              )
            }
            return NextResponse.json({ data })


    
}
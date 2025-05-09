import { NextResponse } from 'next/server'

export async function POST(req: { json: () => any }) {
    const body = await req.json()
    const { trackingId } = body
    const bodys = new FormData();
    bodys.set("trackingId", trackingId);
    
    const resp = await fetch('https://courierwallah.in/api/getbyid.php', {
        method: 'POST',
        body: bodys,
      });
    
    if (!resp.ok) {
      throw new Error('Network response was not ok');
    }
    if (resp.status !== 200) {
      throw new Error('Invalid ');
    }
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